import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { eq, inArray } from "drizzle-orm";
import { env } from "./config/env";
import { db } from "./db/client";
import { pricings, tokens } from "./db/schema";

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/tokens", async (_req, res) => {
  try {
    const records = await db
      .select({
        id: tokens.id,
        symbol: tokens.symbol,
        displayName: tokens.displayName,
        createdAt: tokens.createdAt,
      })
      .from(tokens);

    res.json(records);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch tokens",
      details: (error as Error).message,
    });
  }
});

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  },
});

// Store subscriptions: Map<socketId, pairs>
const subscriptions = new Map<string, string | null>();

// Namespace for pricings
const pricingsNamespace = io.of("/pricings");

pricingsNamespace.on("connection", (socket) => {
  subscriptions.set(socket.id, null);
  socket.on("subscribe", async (data: { pairs: string }) => {
    try {
      const { pairs } = data;
      if (!pairs) {
        socket.emit("error", { message: "pairs is required" });
        return;
      }

      // Parse pairs: tokenId1/tokenId2
      const [tokenId1, tokenId2] = pairs.split("/");
      if (!tokenId1 || !tokenId2) {
        socket.emit("error", {
          message: "Invalid pairs format. Expected: tokenId1/tokenId2",
        });
        return;
      }

      // Verify both tokens exist (single query)
      const foundTokens = await db
        .select()
        .from(tokens)
        .where(inArray(tokens.id, [tokenId1, tokenId2]));

      const token1 = foundTokens.find((t) => t.id === tokenId1);
      const token2 = foundTokens.find((t) => t.id === tokenId2);

      if (!token1) {
        socket.emit("error", { message: `Token ${tokenId1} not found` });
        return;
      }
      if (!token2) {
        socket.emit("error", { message: `Token ${tokenId2} not found` });
        return;
      }

      // Add to subscriptions (one pair per client)
      subscriptions.set(socket.id, pairs);
      await emitPairPricingUpdates(socket, tokenId1, tokenId2);
    } catch (error) {
      socket.emit("error", {
        message: "Failed to subscribe",
        details: (error as Error).message,
      });
    }
  });

  socket.on("disconnect", () => {
    subscriptions.delete(socket.id);
  });
});

// Interval to send pricing updates every 5 seconds
setInterval(async () => {
  try {
    // Process all subscribed pairs
    const promises = Array.from(subscriptions.entries()).map(
      async ([socketId, pairs]) => {
        if (!pairs) {
          return;
        }

        const [tokenId1, tokenId2] = pairs.split("/");
        if (!tokenId1 || !tokenId2) {
          return;
        }

        const socket = pricingsNamespace.sockets.get(socketId);
        if (socket) {
          await emitPairPricingUpdates(socket, tokenId1, tokenId2);
        }
      }
    );

    await Promise.all(promises);
  } catch (error) {
    // Error handling
  }
}, 5000); // 5 seconds

httpServer.listen(env.port);

async function emitPairPricingUpdates(
  targetSocket: Socket,
  tokenId1: string,
  tokenId2: string
) {
  try {
    // Fetch base prices for both tokens
    const pricingsData = await db
      .select({
        pricingId: pricings.id,
        tokenId: tokens.id,
        symbol: tokens.symbol,
        displayName: tokens.displayName,
        basePrice: pricings.basePrice,
        currency: pricings.currency,
        updatedAt: pricings.updatedAt,
      })
      .from(pricings)
      .innerJoin(tokens, eq(pricings.tokenId, tokens.id))
      .where(inArray(tokens.id, [tokenId1, tokenId2]));

    if (pricingsData.length !== 2) {
      return;
    }

    // Calculate prices with random variation (-5% to +5%)
    const calculatePrice = (basePrice: string) => {
      const base = parseFloat(basePrice || "0");
      const randomVariation = Math.random() * 0.1 - 0.05; // -0.05 to 0.05
      return base * (1 + randomVariation);
    };

    const pricing1 = pricingsData.find((p) => p.tokenId === tokenId1);
    const pricing2 = pricingsData.find((p) => p.tokenId === tokenId2);

    if (!pricing1 || !pricing2) {
      return;
    }

    const pair1 = {
      tokenId: pricing1.tokenId,
      symbol: pricing1.symbol,
      displayName: pricing1.displayName,
      basePrice: pricing1.basePrice,
      price: calculatePrice(pricing1.basePrice || "0").toFixed(8),
      currency: pricing1.currency,
      updatedAt: pricing1.updatedAt,
    };

    const pair2 = {
      tokenId: pricing2.tokenId,
      symbol: pricing2.symbol,
      displayName: pricing2.displayName,
      basePrice: pricing2.basePrice,
      price: calculatePrice(pricing2.basePrice || "0").toFixed(8),
      currency: pricing2.currency,
      updatedAt: pricing2.updatedAt,
    };

    console.log(
      `[pricing:update] socket=${targetSocket.id} pairs=${tokenId1}/${tokenId2}`
    );
    targetSocket.emit("pricing:update", { pair1, pair2 });
  } catch (error) {
    // Error handling
  }
}

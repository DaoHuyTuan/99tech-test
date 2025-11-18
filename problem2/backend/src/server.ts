import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { eq, inArray } from "drizzle-orm";
import { env } from "./config/env";
import { db } from "./db/client";
import { pricings, tokens } from "./db/schema";

const app = express();
app.use(express.json());

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

// Store subscriptions: Map<socketId, tokenId>
const subscriptions = new Map<string, string | null>();

// Namespace for pricings
const pricingsNamespace = io.of("/pricings");

pricingsNamespace.on("connection", (socket) => {
  subscriptions.set(socket.id, null);
  socket.on("subscribe", async (data: { tokenId: string }) => {
    try {
      const { tokenId } = data;
      if (!tokenId) {
        socket.emit("error", { message: "tokenId is required" });
        return;
      }

      // Verify token exists
      const [token] = await db
        .select()
        .from(tokens)
        .where(eq(tokens.id, tokenId))
        .limit(1);

      if (!token) {
        socket.emit("error", { message: `Token ${tokenId} not found` });
        return;
      }

      // Add to subscriptions (one token per client)
      subscriptions.set(socket.id, tokenId);
      await emitPricingUpdates(socket, [tokenId]);
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
    // Get all unique tokenIds that are subscribed
    const subscribedTokenIds = Array.from(
      new Set(
        Array.from(subscriptions.values()).filter(
          (tokenId): tokenId is string => Boolean(tokenId)
        )
      )
    );

    if (subscribedTokenIds.length === 0) {
      return;
    }

    await emitPricingUpdates(undefined, subscribedTokenIds);
  } catch (error) {
    // Error handling
  }
}, 5000); // 5 seconds

httpServer.listen(env.port);

async function emitPricingUpdates(
  targetSocket: Socket | undefined,
  tokenIds: string[]
) {
  if (tokenIds.length === 0) {
    return;
  }

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
    .where(inArray(tokens.id, tokenIds));

  const pricingUpdates = pricingsData.map((pricing) => {
    const basePrice = parseFloat(pricing.basePrice || "0");
    const randomVariation = Math.random() * 0.1 - 0.05;
    const calculatedPrice = basePrice * (1 + randomVariation);

    return {
      tokenId: pricing.tokenId,
      symbol: pricing.symbol,
      displayName: pricing.displayName,
      basePrice: pricing.basePrice,
      price: calculatedPrice.toFixed(8),
      currency: pricing.currency,
      updatedAt: pricing.updatedAt,
    };
  });

  if (targetSocket) {
    const tokenId = subscriptions.get(targetSocket.id);
    if (!tokenId) {
      return;
    }
    const clientUpdates = pricingUpdates.filter(
      (update) => update.tokenId === tokenId
    );
    if (clientUpdates.length > 0) {
      console.log(
        `[pricing:update] socket=${targetSocket.id} tokens=${clientUpdates
          .map((u) => u.tokenId)
          .join(",")}`
      );
      targetSocket.emit("pricing:update", clientUpdates);
    }
    return;
  }

  subscriptions.forEach((tokenId, socketId) => {
    const socket = pricingsNamespace.sockets.get(socketId);
    if (!socket || !tokenId) {
      return;
    }
    const clientUpdates = pricingUpdates.filter(
      (update) => update.tokenId === tokenId
    );
    if (clientUpdates.length > 0) {
      console.log(
        `[pricing:update] socket=${socket.id} tokens=${clientUpdates
          .map((u) => u.tokenId)
          .join(",")}`
      );
      socket.emit("pricing:update", clientUpdates);
    }
  });
}

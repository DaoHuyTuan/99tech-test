// using loop
const sum_to_n_a = (n) => {
  var sum = 0;
  for (var i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// using formular
const sum_to_n_b = (n) => {
  return (n * (n + 1)) / 2;
};

// recursion
const sum_to_n_c = (n) => {
  if (n <= 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_c(n - 1);
};

console.log("using loop sum_to_n_a(5):", sum_to_n_a(5));
console.log("using formular sum_to_n_b(5):", sum_to_n_b(5));
console.log("using recursion sum_to_n_c(5):", sum_to_n_c(5));

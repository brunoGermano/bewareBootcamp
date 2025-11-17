export const formatCentsToBRL = (cents: number) => {
  // Using "Intl" API from java script to convert the coin to BRL
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
};

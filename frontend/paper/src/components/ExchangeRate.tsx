import { Card, CardHeader, CardContent } from "@/components/ui/card";

const exchangeRates = [
  {
    from: "USD",
    fromName: "United States Dollar",
    to: "INR",
    toName: "Indian Rupee",
    rate: "85.273",
    lastUpdated: "2025-04-03 14:09:35 UTC",
  },
  {
    from: "EUR",
    fromName: "Euro",
    to: "INR",
    toName: "Indian Rupee",
    rate: "94.6416",
    lastUpdated: "2025-04-03 14:10:40 UTC",
  },
  {
    from: "CNY",
    fromName: "Chinese Yuan",
    to: "INR",
    toName: "Indian Rupee",
    rate: "11.7142",
    lastUpdated: "2025-04-03 14:12:00 UTC",
  },
];

const CurrencyExchangeRates = () => {
  return (
    <div className="w-full flex flex-col items-center mt-6">
      <h2 className="text-2xl font-bold mb-4">💱 Currency Exchange Rates</h2>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        {exchangeRates.map((exchange, index) => (
          <Card key={index} className="p-4 shadow-md border border-gray-200">
            <CardHeader>
              <h2 className="text-lg font-bold">
                {exchange.from} → {exchange.to}
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{exchange.rate}</p>
              <p className="text-xs text-gray-500">
                Updated: {exchange.lastUpdated}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CurrencyExchangeRates;

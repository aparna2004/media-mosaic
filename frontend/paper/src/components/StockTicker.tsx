import { motion } from "framer-motion";
import { Finance } from "@/types/finance";

const allStocks: Finance[] = [
  { ticker: "AREB", price: "6.29", change_percentage: "342.95%", type: "gainer" },
  { ticker: "IBG", price: "1.25", change_percentage: "152.42%", type: "gainer"},
  { ticker: "SPWH", price: "1.91", change_percentage: "97.92%", type: "gainer" },
  { ticker: "TTEC", price: "4.99", change_percentage: "52.59%", type: "gainer"},
  { ticker: "JYD", price: "0.3455", change_percentage: "-95.66%", type: "loser" },
  { ticker: "NMAX", price: "52.63", change_percentage: "-77.41%", type: "loser" },
  { ticker: "RSLS", price: "0.45", change_percentage: "-71.69%", type: "loser" }
];

export default function StockTicker() {

  const repeatedStocks = [...allStocks, ...allStocks, ...allStocks];

  return (
    <div className="w-full overflow-hidden bg-white border border-gray-300 py-1.5">
      <div className="relative w-full">
        <motion.div
          className="flex whitespace-nowrap"
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{ 
            repeat: Infinity, 
            duration: 30, 
            ease: "linear",
            repeatType: "loop" 
          }}
        >
          {/* First set of stocks */}
          <div className="flex space-x-8 mr-8">
            {repeatedStocks.map((stock, index) => (
              <div
                key={`first-${index}`}
                className="flex items-center space-x-1"
              >
                <span className="font-medium">{stock.ticker}</span>
                <span className="text-gray-700">${stock.price}</span>
                <span className={`
                  ${stock.type === "gainer" ? "text-emerald-600" : "text-red-600"}
                  font-medium
                `}>
                  {stock.change_percentage}
                </span>
              </div>
            ))}
          </div>

          {/* Duplicate set of stocks to ensure continuous flow */}
          <div className="flex space-x-8">
            {repeatedStocks.map((stock, index) => (
              <div
                key={`second-${index}`}
                className="flex items-center space-x-1"
              >
                <span className="font-medium">{stock.ticker}</span>
                <span className="text-gray-700">${stock.price}</span>
                <span className={`
                  ${stock.type === "gainer" ? "text-emerald-600" : "text-red-600"}
                  font-medium
                `}>
                  {stock.change_percentage}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
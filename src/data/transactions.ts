export type TransactionType = "income" | "expense";

export type Category =
  | "Salary"
  | "Freelance"
  | "Investments"
  | "Crypto"
  | "Dining"
  | "Shopping"
  | "Subscriptions"
  | "Travel"
  | "Transportation"
  | "Utilities"
  | "Healthcare"
  | "Entertainment"
  | "Education"
  | "Rent"
  | "Groceries"
  | "Bills"
  | "Transfer"
  | "Others";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  counterparty: string;
  status: "completed" | "pending" | "failed";
}

// Financial profile: ₹80,000/month income, ~₹50,000 avg expenses, ~₹30,000 avg savings
// Three months: Jan 2026 (₹48,600 exp), Feb 2026 (₹51,500 exp), Mar 2026 (₹49,900 exp)
export const mockTransactions: Transaction[] = [

  // ── January 2026 ── income ₹80,000 | expenses ₹48,600 | savings ₹31,400
  { id: "t001", date: "2026-01-01", description: "Monthly salary deposit",      amount: 80000, type: "income",  category: "Salary",    counterparty: "TechCorp Ltd",       status: "completed" },

  // Rent
  { id: "t002", date: "2026-01-01", description: "House rent – January",        amount: 20000, type: "expense", category: "Rent",      counterparty: "Sunrise Apartments", status: "completed" },

  // Bills (8,200)
  { id: "t003", date: "2026-01-02", description: "Electricity bill",            amount:  3500, type: "expense", category: "Bills",     counterparty: "City Power Corp",    status: "completed" },
  { id: "t004", date: "2026-01-03", description: "Internet & broadband",        amount:  1499, type: "expense", category: "Bills",     counterparty: "FiberNet ISP",       status: "completed" },
  { id: "t005", date: "2026-01-04", description: "Mobile recharge",             amount:   899, type: "expense", category: "Bills",     counterparty: "Airtel",             status: "completed" },
  { id: "t006", date: "2026-01-05", description: "Society maintenance",         amount:  2302, type: "expense", category: "Bills",     counterparty: "Society Office",     status: "completed" },

  // Groceries (4,800)
  { id: "t007", date: "2026-01-06", description: "Weekly groceries",            amount:  1350, type: "expense", category: "Groceries", counterparty: "D-Mart",             status: "completed" },
  { id: "t008", date: "2026-01-13", description: "Grocery restock",             amount:  1200, type: "expense", category: "Groceries", counterparty: "Big Bazaar",         status: "completed" },
  { id: "t009", date: "2026-01-19", description: "Fresh produce & dairy",       amount:   950, type: "expense", category: "Groceries", counterparty: "Zepto",              status: "completed" },
  { id: "t010", date: "2026-01-26", description: "Monthly supplies",            amount:  1300, type: "expense", category: "Groceries", counterparty: "Blinkit",            status: "completed" },

  // Shopping (9,500)
  { id: "t011", date: "2026-01-08", description: "Electronics purchase",        amount:  3999, type: "expense", category: "Shopping",  counterparty: "Amazon",             status: "completed" },
  { id: "t012", date: "2026-01-15", description: "Clothing & apparel",          amount:  2799, type: "expense", category: "Shopping",  counterparty: "Myntra",             status: "completed" },
  { id: "t013", date: "2026-01-22", description: "Home essentials",             amount:  2702, type: "expense", category: "Shopping",  counterparty: "IKEA",               status: "completed" },

  // Dining (2,900)
  { id: "t014", date: "2026-01-07", description: "Dinner out",                  amount:   850, type: "expense", category: "Dining",    counterparty: "Taj Sats Restaurant",status: "completed" },
  { id: "t015", date: "2026-01-12", description: "Team lunch",                  amount:   650, type: "expense", category: "Dining",    counterparty: "Cafe Coffee Day",    status: "completed" },
  { id: "t016", date: "2026-01-18", description: "Family dinner",               amount:   900, type: "expense", category: "Dining",    counterparty: "Pizza Hut",          status: "completed" },
  { id: "t017", date: "2026-01-25", description: "Quick bite",                  amount:   500, type: "expense", category: "Dining",    counterparty: "McDonald's",         status: "completed" },

  // Travel (3,200)
  { id: "t018", date: "2026-01-14", description: "Train tickets",               amount:  1400, type: "expense", category: "Travel",    counterparty: "IRCTC",              status: "completed" },
  { id: "t019", date: "2026-01-20", description: "Cab rides",                   amount:   850, type: "expense", category: "Travel",    counterparty: "Ola",                status: "completed" },
  { id: "t020", date: "2026-01-28", description: "Flight booking",              amount:   950, type: "expense", category: "Travel",    counterparty: "IndiGo Airlines",    status: "completed" },

  // ── February 2026 ── income ₹80,000 | expenses ₹51,500 | savings ₹28,500
  { id: "t021", date: "2026-02-01", description: "Monthly salary deposit",      amount: 80000, type: "income",  category: "Salary",    counterparty: "TechCorp Ltd",       status: "completed" },

  // Rent
  { id: "t022", date: "2026-02-01", description: "House rent – February",       amount: 20000, type: "expense", category: "Rent",      counterparty: "Sunrise Apartments", status: "completed" },

  // Bills (8,800)
  { id: "t023", date: "2026-02-02", description: "Electricity bill",            amount:  3900, type: "expense", category: "Bills",     counterparty: "City Power Corp",    status: "completed" },
  { id: "t024", date: "2026-02-03", description: "Internet & broadband",        amount:  1499, type: "expense", category: "Bills",     counterparty: "FiberNet ISP",       status: "completed" },
  { id: "t025", date: "2026-02-04", description: "Mobile recharge",             amount:   899, type: "expense", category: "Bills",     counterparty: "Airtel",             status: "completed" },
  { id: "t026", date: "2026-02-05", description: "Society maintenance",         amount:  2502, type: "expense", category: "Bills",     counterparty: "Society Office",     status: "completed" },

  // Groceries (5,300)
  { id: "t027", date: "2026-02-07", description: "Weekly groceries",            amount:  1600, type: "expense", category: "Groceries", counterparty: "D-Mart",             status: "completed" },
  { id: "t028", date: "2026-02-13", description: "Grocery restock",             amount:  1350, type: "expense", category: "Groceries", counterparty: "Big Bazaar",         status: "completed" },
  { id: "t029", date: "2026-02-19", description: "Fresh produce & dairy",       amount:  1100, type: "expense", category: "Groceries", counterparty: "Zepto",              status: "completed" },
  { id: "t030", date: "2026-02-25", description: "Monthly supplies",            amount:  1250, type: "expense", category: "Groceries", counterparty: "Blinkit",            status: "completed" },

  // Shopping (10,500)
  { id: "t031", date: "2026-02-09", description: "Valentine's shopping",        amount:  4200, type: "expense", category: "Shopping",  counterparty: "Amazon",             status: "completed" },
  { id: "t032", date: "2026-02-14", description: "Clothing sale",               amount:  3100, type: "expense", category: "Shopping",  counterparty: "Myntra",             status: "completed" },
  { id: "t033", date: "2026-02-21", description: "Sports gear",                 amount:  3200, type: "expense", category: "Shopping",  counterparty: "Decathlon",          status: "completed" },

  // Dining (3,200)
  { id: "t034", date: "2026-02-08", description: "Valentine's dinner",          amount:  1200, type: "expense", category: "Dining",    counterparty: "The Oberoi",         status: "completed" },
  { id: "t035", date: "2026-02-14", description: "Romantic dinner",             amount:   950, type: "expense", category: "Dining",    counterparty: "Italian Kitchen",    status: "completed" },
  { id: "t036", date: "2026-02-19", description: "Office party",                amount:   650, type: "expense", category: "Dining",    counterparty: "Barbeque Nation",    status: "completed" },
  { id: "t037", date: "2026-02-27", description: "Weekend brunch",              amount:   400, type: "expense", category: "Dining",    counterparty: "Café Mocha",         status: "completed" },

  // Travel (3,700)
  { id: "t038", date: "2026-02-10", description: "Weekend getaway",             amount:  1800, type: "expense", category: "Travel",    counterparty: "MakeMyTrip",         status: "completed" },
  { id: "t039", date: "2026-02-16", description: "Cab transport",               amount:   700, type: "expense", category: "Travel",    counterparty: "Uber",               status: "completed" },
  { id: "t040", date: "2026-02-22", description: "Bus tickets",                 amount:  1200, type: "expense", category: "Travel",    counterparty: "RedBus",             status: "completed" },

  // ── March 2026 ── income ₹80,000 | expenses ₹49,900 | savings ₹30,100
  { id: "t041", date: "2026-03-01", description: "Monthly salary deposit",      amount: 80000, type: "income",  category: "Salary",    counterparty: "TechCorp Ltd",       status: "completed" },

  // Rent
  { id: "t042", date: "2026-03-01", description: "House rent – March",          amount: 20000, type: "expense", category: "Rent",      counterparty: "Sunrise Apartments", status: "completed" },

  // Bills (8,500)
  { id: "t043", date: "2026-03-02", description: "Electricity bill",            amount:  3600, type: "expense", category: "Bills",     counterparty: "City Power Corp",    status: "completed" },
  { id: "t044", date: "2026-03-03", description: "Internet & broadband",        amount:  1499, type: "expense", category: "Bills",     counterparty: "FiberNet ISP",       status: "completed" },
  { id: "t045", date: "2026-03-04", description: "Mobile recharge",             amount:   899, type: "expense", category: "Bills",     counterparty: "Airtel",             status: "completed" },
  { id: "t046", date: "2026-03-05", description: "Society maintenance",         amount:  2502, type: "expense", category: "Bills",     counterparty: "Society Office",     status: "completed" },

  // Groceries (4,900)
  { id: "t047", date: "2026-03-06", description: "Weekly groceries",            amount:  1400, type: "expense", category: "Groceries", counterparty: "D-Mart",             status: "completed" },
  { id: "t048", date: "2026-03-12", description: "Grocery restock",             amount:  1200, type: "expense", category: "Groceries", counterparty: "Big Bazaar",         status: "completed" },
  { id: "t049", date: "2026-03-19", description: "Fresh produce & dairy",       amount:  1050, type: "expense", category: "Groceries", counterparty: "Zepto",              status: "completed" },
  { id: "t050", date: "2026-03-26", description: "Monthly supplies",            amount:  1250, type: "expense", category: "Groceries", counterparty: "Blinkit",            status: "completed" },

  // Shopping (10,000)
  { id: "t051", date: "2026-03-10", description: "Online shopping",             amount:  3500, type: "expense", category: "Shopping",  counterparty: "Amazon",             status: "completed" },
  { id: "t052", date: "2026-03-15", description: "Clothing & apparel",          amount:  2800, type: "expense", category: "Shopping",  counterparty: "Myntra",             status: "completed" },
  { id: "t053", date: "2026-03-22", description: "Electronics",                 amount:  3700, type: "expense", category: "Shopping",  counterparty: "Flipkart",           status: "completed" },

  // Dining (2,900)
  { id: "t054", date: "2026-03-08", description: "Dinner out",                  amount:   850, type: "expense", category: "Dining",    counterparty: "Mainland China",     status: "completed" },
  { id: "t055", date: "2026-03-14", description: "Lunch",                       amount:   600, type: "expense", category: "Dining",    counterparty: "KFC",                status: "completed" },
  { id: "t056", date: "2026-03-20", description: "Celebration dinner",          amount:   950, type: "expense", category: "Dining",    counterparty: "Hard Rock Cafe",     status: "completed" },
  { id: "t057", date: "2026-03-28", description: "Quick food",                  amount:   500, type: "expense", category: "Dining",    counterparty: "Burger King",        status: "completed" },

  // Travel (3,600)
  { id: "t058", date: "2026-03-11", description: "Train tickets",               amount:  1500, type: "expense", category: "Travel",    counterparty: "IRCTC",              status: "completed" },
  { id: "t059", date: "2026-03-18", description: "Hotel booking",               amount:  1400, type: "expense", category: "Travel",    counterparty: "OYO",                status: "completed" },
  { id: "t060", date: "2026-03-25", description: "Cab transport",               amount:   700, type: "expense", category: "Travel",    counterparty: "Ola",                status: "completed" },
];

// Helper: category colors for charts/badges
export const categoryColors: Record<Category, string> = {
  Salary:         "#a6ef27",
  Freelance:      "#b3fe38",
  Investments:    "#00deec",
  Crypto:         "#e9b3ff",
  Dining:         "#fe7453",
  Shopping:       "#d277ff",
  Subscriptions:  "#8ff5ff",
  Travel:         "#e8ffc1",
  Transportation: "#757480",
  Utilities:      "#abaab6",
  Healthcare:     "#00deec",
  Entertainment:  "#fe7453",
  Education:      "#a6ef27",
  Rent:           "#474752",
  Groceries:      "#b3fe38",
  Bills:          "#f59e0b",
  Transfer:       "#e6e4f1",
  Others:         "#757480",
};

// Category icons (lucide icon names)
export const categoryIcons: Record<Category, string> = {
  Salary:         "Briefcase",
  Freelance:      "Code",
  Investments:    "TrendingUp",
  Crypto:         "Bitcoin",
  Dining:         "UtensilsCrossed",
  Shopping:       "ShoppingBag",
  Subscriptions:  "CreditCard",
  Travel:         "Plane",
  Transportation: "Car",
  Utilities:      "Zap",
  Healthcare:     "Heart",
  Entertainment:  "Music",
  Education:      "GraduationCap",
  Rent:           "Home",
  Groceries:      "Apple",
  Bills:          "Receipt",
  Transfer:       "ArrowLeftRight",
  Others:         "Package",
};

export const allCategories: Category[] = [
  "Salary", "Freelance", "Investments", "Crypto",
  "Dining", "Shopping", "Subscriptions", "Travel",
  "Transportation", "Utilities", "Healthcare", "Entertainment",
  "Education", "Rent", "Groceries", "Bills", "Transfer", "Others",
];

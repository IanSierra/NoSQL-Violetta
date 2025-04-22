import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QueryEditor from "@/components/Database/QueryEditor";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";

const MongoAggregations = () => {
  const [results, setResults] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [visualization, setVisualization] = useState<string>("table");

  // Sample aggregation templates
  const aggregationTemplates = {
    groupBy: `// Example group by aggregation
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$category",
      count: { $sum: 1 },
      totalSales: { $sum: "$total" },
      avgOrderValue: { $avg: "$total" }
    }
  },
  { $sort: { totalSales: -1 } }
])`,
    lookups: `// Example lookup (join) aggregation
db.orders.aggregate([
  { $match: { _id: ObjectId("60d5ec7ac9e24120581d7663") } },
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "userDetails"
    }
  },
  { $unwind: "$userDetails" },
  { $project: {
      orderId: "$_id",
      products: 1,
      total: 1,
      "user.name": "$userDetails.name",
      "user.email": "$userDetails.email"
    }
  }
])`,
    statistics: `// Example statistical aggregation
db.products.aggregate([
  { $match: { category: "electronics" } },
  { $group: {
      _id: null,
      count: { $sum: 1 },
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" },
      stdDevPrice: { $stdDevPop: "$price" }
    }
  }
])`,
    timeSeries: `// Example time-series aggregation
db.sales.aggregate([
  { $match: { 
      date: { 
        $gte: ISODate("2023-01-01"), 
        $lt: ISODate("2023-12-31") 
      } 
    }
  },
  { $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
      sales: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
])`,
  };

  const [currentAggregation, setCurrentAggregation] = useState(aggregationTemplates.groupBy);

  // Sample mock result data for different aggregation types
  const mockResults = {
    groupBy: [
      { _id: "electronics", count: 1243, totalSales: 89520.43, avgOrderValue: 72.02 },
      { _id: "clothing", count: 987, totalSales: 45237.89, avgOrderValue: 45.83 },
      { _id: "books", count: 643, totalSales: 12876.45, avgOrderValue: 20.03 },
      { _id: "home", count: 421, totalSales: 35642.87, avgOrderValue: 84.66 },
      { _id: "beauty", count: 328, totalSales: 18942.32, avgOrderValue: 57.75 },
    ],
    lookups: {
      orderId: "60d5ec7ac9e24120581d7663",
      products: [
        { productId: "p123", name: "Wireless Headphones", price: 79.99, qty: 1 },
        { productId: "p456", name: "USB-C Cable", price: 12.99, qty: 2 }
      ],
      total: 105.97,
      user: {
        name: "John Smith",
        email: "john.smith@example.com"
      }
    },
    statistics: [
      {
        _id: null,
        count: 156,
        avgPrice: 324.87,
        minPrice: 12.99,
        maxPrice: 1299.99,
        stdDevPrice: 245.32
      }
    ],
    timeSeries: [
      { _id: "2023-01", sales: 12543.87, count: 187 },
      { _id: "2023-02", sales: 14327.65, count: 215 },
      { _id: "2023-03", sales: 19854.32, count: 278 },
      { _id: "2023-04", sales: 21432.76, count: 302 },
      { _id: "2023-05", sales: 18765.43, count: 267 },
      { _id: "2023-06", sales: 23456.78, count: 321 },
      { _id: "2023-07", sales: 26789.12, count: 356 },
      { _id: "2023-08", sales: 21345.67, count: 289 },
      { _id: "2023-09", sales: 19876.54, count: 276 },
      { _id: "2023-10", sales: 24567.89, count: 334 },
      { _id: "2023-11", sales: 29876.54, count: 412 },
      { _id: "2023-12", sales: 35678.90, count: 487 }
    ]
  };

  const handleExecution = () => {
    setIsLoading(true);
    
    // Mock execution time between 50-300ms
    const executionTime = Math.floor(Math.random() * 250) + 50;
    
    setTimeout(() => {
      // Generate results based on the current aggregation type
      let resultData;
      
      if (currentAggregation.includes("category")) {
        resultData = mockResults.groupBy;
        setVisualization("bar");
      } else if (currentAggregation.includes("lookup")) {
        resultData = mockResults.lookups;
        setVisualization("table");
      } else if (currentAggregation.includes("statistical")) {
        resultData = mockResults.statistics;
        setVisualization("pie");
      } else if (currentAggregation.includes("time-series")) {
        resultData = mockResults.timeSeries;
        setVisualization("line");
      } else {
        // Default to table view
        resultData = mockResults.groupBy;
        setVisualization("table");
      }
      
      setResults(resultData);
      setExecutionTime(executionTime);
      setIsLoading(false);
    }, 800); // Simulate network delay
  };

  const handleTemplateChange = (template: keyof typeof aggregationTemplates) => {
    setCurrentAggregation(aggregationTemplates[template]);
    setResults([]);
    setExecutionTime(null);
    setVisualization("table");
  };

  const renderVisualization = () => {
    if (!results || results.length === 0) {
      return (
        <div className="text-center py-8 text-neutral-medium">
          Execute an aggregation to see results
        </div>
      );
    }

    if (visualization === "table") {
      return (
        <div className="overflow-x-auto">
          <pre className="p-4 bg-neutral-lightest rounded-md font-mono text-sm">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      );
    }

    if (visualization === "bar" && Array.isArray(results)) {
      return (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={results}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalSales" fill="#00684A" name="Total Sales" />
              <Bar dataKey="count" fill="#13AA52" name="Order Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (visualization === "pie" && Array.isArray(results)) {
      const COLORS = ['#00684A', '#13AA52', '#69D0AC', '#1F4F9E', '#4A77D6'];
      
      // Create data for pie chart from statistics
      const pieData = [
        { name: 'Avg Price', value: results[0].avgPrice },
        { name: 'Min Price', value: results[0].minPrice },
        { name: 'Max Price', value: results[0].maxPrice },
        { name: 'Std Dev', value: results[0].stdDevPrice }
      ];
      
      return (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (visualization === "line" && Array.isArray(results)) {
      return (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={results}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis yAxisId="left" orientation="left" stroke="#00684A" />
              <YAxis yAxisId="right" orientation="right" stroke="#1F4F9E" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#00684A" name="Sales ($)" />
              <Line yAxisId="right" type="monotone" dataKey="count" stroke="#1F4F9E" name="Order Count" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <pre className="p-4 bg-neutral-lightest rounded-md font-mono text-sm">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="p-6 bg-neutral-lightest">
      <h2 className="text-2xl font-semibold mb-6">MongoDB Aggregations</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Aggregation Pipeline</CardTitle>
            <CardDescription>Create and execute MongoDB aggregation pipelines</CardDescription>
            
            <div className="mt-2">
              <Tabs defaultValue="groupBy" className="w-full" onValueChange={(value) => handleTemplateChange(value as keyof typeof aggregationTemplates)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="groupBy">Group By</TabsTrigger>
                  <TabsTrigger value="lookups">Lookups (Joins)</TabsTrigger>
                  <TabsTrigger value="statistics">Statistics</TabsTrigger>
                  <TabsTrigger value="timeSeries">Time Series</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <QueryEditor
              language="javascript"
              value={currentAggregation}
              onChange={setCurrentAggregation}
              height="240px"
            />
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="text-sm text-neutral-medium">
              {executionTime !== null && `Aggregation executed in ${executionTime}ms`}
            </div>
            <div className="flex space-x-2">
              {results && results.length > 0 && (
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-none ${visualization === 'table' ? 'bg-neutral-light' : ''}`}
                    onClick={() => setVisualization('table')}
                  >
                    Table
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-none ${visualization === 'bar' ? 'bg-neutral-light' : ''}`}
                    onClick={() => setVisualization('bar')}
                    disabled={!Array.isArray(results)}
                  >
                    Bar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-none ${visualization === 'pie' ? 'bg-neutral-light' : ''}`}
                    onClick={() => setVisualization('pie')}
                    disabled={!Array.isArray(results)}
                  >
                    Pie
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-none ${visualization === 'line' ? 'bg-neutral-light' : ''}`}
                    onClick={() => setVisualization('line')}
                    disabled={!Array.isArray(results)}
                  >
                    Line
                  </Button>
                </div>
              )}
              <Button 
                className="bg-[#00684A] hover:bg-[#13AA52] text-white"
                onClick={handleExecution}
                disabled={isLoading}
              >
                {isLoading ? "Executing..." : "Execute Aggregation"}
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              Results
              {visualization !== "table" && ` (${visualization.charAt(0).toUpperCase() + visualization.slice(1)} Visualization)`}
            </CardTitle>
            <CardDescription>Aggregation pipeline output</CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderVisualization()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MongoAggregations;

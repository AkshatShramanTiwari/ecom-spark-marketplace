
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Edit, Trash2, AlertTriangle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { mockProducts } from "@/data/mockData";
import { Product } from "@/types";
import { toast } from "sonner";

const SellerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  
  useEffect(() => {
    if (user) {
      // Filter products belonging to the current seller
      const sellerProducts = mockProducts.filter(
        product => product.sellerId === user.id
      );
      setProducts(sellerProducts);
      setFilteredProducts(sellerProducts);
    }
  }, [user]);
  
  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];
      
      // Apply search filter
      if (searchQuery) {
        filtered = filtered.filter(
          product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Apply category filter
      if (categoryFilter !== "all") {
        filtered = filtered.filter(
          product => product.category.toLowerCase() === categoryFilter
        );
      }
      
      // Apply stock filter
      if (stockFilter === "low") {
        filtered = filtered.filter(product => product.stock <= 10 && product.stock > 0);
      } else if (stockFilter === "out") {
        filtered = filtered.filter(product => product.stock === 0);
      } else if (stockFilter === "in") {
        filtered = filtered.filter(product => product.stock > 10);
      }
      
      setFilteredProducts(filtered);
    }
  }, [products, searchQuery, categoryFilter, stockFilter]);
  
  const handleDelete = (productId: string) => {
    // In a real app, this would be an API call
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    toast.success("Product deleted successfully");
  };
  
  // Get unique categories for filter
  const categories = Array.from(
    new Set(products.map(product => product.category.toLowerCase()))
  );

  if (!user || user.role !== "seller") {
    return (
      <MainLayout>
        <div className="ecom-container py-12">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">
              You need to be logged in as a seller to access this page.
            </p>
            <div className="space-x-4">
              <Button asChild variant="outline">
                <Link to="/">Go Home</Link>
              </Button>
              <Button asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="ecom-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Products</h1>
            <p className="text-gray-500">Manage your products inventory</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button asChild>
              <Link to="/seller/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-gray-400" />
              <Select
                value={stockFilter}
                onValueChange={setStockFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="in">In Stock (>10)</SelectItem>
                  <SelectItem value="low">Low Stock (≤10)</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-medium line-clamp-1">{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {product.stock <= 10 && product.stock > 0 ? (
                            <div className="flex items-center text-amber-600">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              <span>{product.stock}</span>
                            </div>
                          ) : product.stock === 0 ? (
                            <span className="text-red-500">Out of stock</span>
                          ) : (
                            <span>{product.stock}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.stock > 0 ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link to={`/seller/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the product
                                  "{product.name}". This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="mb-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Package className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium">No products found</h3>
              <p className="mt-2 text-gray-500">
                {searchQuery || categoryFilter !== "all" || stockFilter !== "all"
                  ? "Try adjusting your filters or search query"
                  : "Start by adding your first product"}
              </p>
              {!searchQuery && categoryFilter === "all" && stockFilter === "all" && (
                <Button className="mt-4" asChild>
                  <Link to="/seller/products/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// Package icon
const Package = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
    <path d="M12 12l8-4.5" />
    <path d="M12 12v9" />
    <path d="M12 12L4 7.5" />
  </svg>
);

export default SellerProducts;

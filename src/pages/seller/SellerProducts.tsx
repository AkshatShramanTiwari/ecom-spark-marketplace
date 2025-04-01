
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductGrid from "@/components/products/ProductGrid";
import { mockProducts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

const SellerProducts = () => {
  const [products, setProducts] = useState(mockProducts.slice(0, 3));
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleAddProduct = () => {
    // In a real app, this would navigate to a form
    // For now, we'll show a toast message
    toast({
      title: "Feature in development",
      description: "The add product functionality is coming soon!",
    });
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Products</h1>
        <Button onClick={handleAddProduct}>
          <Plus className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">You haven't added any products yet.</p>
          <Button className="mt-4" onClick={handleAddProduct}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Product
          </Button>
        </div>
      ) : (
        <div>
          <ProductGrid products={products} />
        </div>
      )}
    </div>
  );
};

export default SellerProducts;

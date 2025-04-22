import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import CollectionTable from "@/components/Database/CollectionTable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Collection name is required"),
  documentCount: z.number().min(0, "Document count must be a positive number"),
  storageSize: z.number().min(0, "Storage size must be a positive number"),
  status: z.string().default("active"),
});

type FormValues = z.infer<typeof formSchema>;

const MongoCollections = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      documentCount: 0,
      storageSize: 0,
      status: "active",
    },
  });

  const { data: collections, isLoading } = useQuery({
    queryKey: ["/api/mongo-collections"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      return apiRequest("POST", "/api/mongo-collections", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mongo-collections"] });
      setIsOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Collection created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create collection: ${error}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data);
  };

  const filteredCollections = collections?.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 bg-neutral-lightest">
        <h2 className="text-2xl font-semibold mb-6">MongoDB Collections</h2>
        <Skeleton className="h-[500px] rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-lightest">
      <h2 className="text-2xl font-semibold mb-6">MongoDB Collections</h2>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-5 border-b border-neutral-light flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M127.979 6C138.156 18.4623 146.498 30.9247 152.006 44.7438C156.346 55.2493 159.518 66.1116 159.518 77.3308C159.518 93.9863 152.845 108.978 140.26 123.134C133.069 131.476 124.727 138.248 115.718 144.174C103.551 152.098 91.8046 159.708 90.5471 178.144C90.1276 182.484 90.1276 186.824 89.708 191.165L88.4506 203.751H88.0311V196.142C88.0311 183.741 90.1276 171.76 97.3189 162.333C100.071 158.411 103.551 154.904 107.054 151.26C118.889 140.345 133.907 132.003 142.497 117.428C145.52 111.921 147.616 105.994 148.455 100.066C149.704 90.8177 148.874 81.5692 147.197 72.4576C145.659 64.1152 141.738 56.5069 138.156 49.0828C130.232 33.8596 117.414 21.9673 106.215 8.98486C105.796 8.56533 104.958 7.30788 104.539 6.41926H99.7797L98.5222 47.767L96.4257 47.3475L96.8452 6.41926H92.0856V47.767H89.2885V6.41926H84.5288L84.9483 47.3475L82.8518 47.767L81.1748 6H78.1824L67.2582 34.6972L65.581 34.2776L72.7724 6H68.0127L62.5054 25.8864V6.41926H58.5854L48.9178 42.6472L46.8213 42.2277L56.4889 6H51.7293L44.7249 31.7633V6H25.8707L16.6221 43.0668L14.5256 42.6472L24.1932 6H19.4336L10.185 43.0668L8.50805 42.6472L17.0416 6H13.1216L3.32945 53.9311L7.66942 54.7697L13.8446 26.7255L15.5215 27.1451L9.76611 54.7697L14.1061 55.6084L20.2813 27.1451L21.9583 27.5647L15.3646 55.6084L19.7045 56.4471L26.2992 27.9843L28.0018 28.4038L22.3778 56.4471L26.7177 57.2857L33.3124 29.2425L35.015 29.6621L29.3909 57.2857L33.7309 58.1244C33.7309 58.1244 37.5247 60.0651 38.2612 60.2209C39.1313 60.3766 39.9229 59.6982 39.9229 58.8282C39.9229 58.4087 39.6424 57.1298 39.6424 57.1298L40.7813 29.6621L42.4583 30.0817L40.9034 57.1298C40.9034 57.1298 40.3622 59.4549 41.0217 60.2209C41.8137 61.143 42.7593 60.8468 43.4373 60.2209C44.2038 59.5265 47.9169 57.2857 47.9169 57.2857L52.2569 58.1244L58.8516 30.9204L60.5542 31.3399L54.9301 58.1244L59.27 58.9631L65.8647 31.7595L67.5673 32.179L61.9432 58.9631L66.2832 59.8017L72.8779 33.0183L74.5805 33.4378L68.9564 59.8017L73.2963 60.6404L79.8911 34.2766L81.5937 34.6972L75.9695 60.6404L80.3095 61.479L87.8042 36.2316C87.8042 36.2316 88.6443 51.9915 89.2885 61.479C90.1276 74.0095 88.8702 86.5399 88.0311 99.0704C87.1921 105.415 86.2052 111.503 83.2713 117.428C82.4322 119.106 81.1748 120.363 80.3357 122.041C77.4019 127.894 73.8962 132.841 70.3906 138.258C66.4706 144.593 62.9649 150.929 60.0311 157.683C57.3582 164.424 55.8075 171.423 55.8075 178.991C55.8075 183.731 55.8075 188.914 56.7354 193.621C57.1354 196.142 57.5356 198.496 58.0156 201.654C58.4352 204.174 60.1122 203.751 59.2731 206.271H95.5878C96.0073 206.271 96.8464 209.357 96.8464 206.69V203.751H168.109C168.529 206.271 169.368 209.21 170.626 211.731C176.962 224.131 184.048 236.112 194.216 246.28C194.636 246.699 195.894 248.377 196.333 248.801H205.762C197.179 239.624 184.779 226.644 180.44 215.237C179.292 212.384 178.383 209.435 177.801 206.69H197.153L196.753 205.012L182.117 198.657C181.698 193.061 181.917 187.399 181.917 181.854C181.917 171.348 184.438 161.261 189.196 151.665C193.797 142.598 200.15 134.674 207.341 127.474C214.532 120.283 222.456 113.092 228.801 104.444C235.146 95.7971 240.335 85.2916 241.173 74.3681C242.012 63.0266 240.335 51.2646 236.833 40.3408C222.875 0.0123291 172.723 0.0123291 166.378 0.0123291C162.038 0.0123291 159.109 0.0123291 154.769 0.0123291C150.429 0.0123291 142.089 2.5329 138.575 4.62946C133.816 6.72601 133.397 10.2317 127.979 6.00001V6ZM168.109 191.584C168.109 191.584 169.786 193.261 171.464 193.261C172.722 193.261 174.399 191.584 174.399 191.584C174.399 179.183 169.786 166.203 161.337 156.844C160.079 155.585 158.402 156.005 158.402 157.683C158.402 160.204 159.66 162.729 160.918 164.825C162.596 167.345 164.693 169.866 165.532 172.806C166.791 177.145 168.109 189.903 168.109 191.584ZM157.144 191.584C157.144 191.584 158.821 193.261 160.499 193.261C161.758 193.261 163.435 191.584 163.435 191.584C163.435 179.183 158.821 166.203 150.372 156.844C149.114 155.585 147.436 156.005 147.436 157.683C147.436 160.204 148.695 162.729 149.953 164.825C151.631 167.345 153.728 169.866 154.567 172.806C155.825 177.145 157.144 189.903 157.144 191.584ZM146.179 191.584C146.179 191.584 147.856 193.261 149.534 193.261C150.792 193.261 152.47 191.584 152.47 191.584C152.47 179.183 147.856 166.203 139.407 156.844C138.149 155.585 136.471 156.005 136.471 157.683C136.471 160.204 137.73 162.729 138.988 164.825C140.666 167.345 142.763 169.866 143.602 172.806C144.86 177.145 146.179 189.903 146.179 191.584Z" fill="#00684A"/>
            </svg>
            <h3 className="font-semibold text-lg">MongoDB Collections</h3>
          </div>
        </div>
        
        <div className="p-5">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Search collections..."
                  className="pl-8 pr-4 py-2 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-medium" />
              </div>
              
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#00684A] hover:bg-[#13AA52] text-white">
                    <Plus className="mr-1 h-4 w-4" />
                    New Collection
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Collection</DialogTitle>
                    <DialogDescription>
                      Add a new MongoDB collection to the system.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Collection Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. users" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="documentCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Document Count</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="storageSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Storage Size (KB)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="0" 
                                {...field}
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormDescription>Size in kilobytes</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="bg-[#00684A] hover:bg-[#13AA52] text-white"
                          disabled={createMutation.isPending}
                        >
                          {createMutation.isPending ? "Creating..." : "Create Collection"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <CollectionTable collections={filteredCollections || []} />
        </div>
      </div>
    </div>
  );
};

export default MongoCollections;

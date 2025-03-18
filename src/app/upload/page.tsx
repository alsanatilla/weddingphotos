"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  photos: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "Please select at least one photo.",
  }),
});

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    form.setValue("photos", e.target.files as FileList);
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsUploading(true);
    
    // Simulate file upload with a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, you would upload the files to your server or storage service here
    console.log("Submitted:", { ...values, photos: selectedFiles });
    
    setIsUploading(false);
    setShowSuccess(true);
    form.reset();
    setSelectedFiles([]);
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Link href="/" className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 mb-8 inline-block">
          &larr; Back to Home
        </Link>
        
        <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Upload Your Photos</CardTitle>
            <CardDescription className="text-center">
              Share your favorite moments from our wedding day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="photos"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Photos</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedFiles.length > 0 && (
                  <div>
                    <Label>Selected Photos ({selectedFiles.length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedFiles.map((file, index) => (
                        <Avatar key={index} className="h-16 w-16">
                          <AvatarImage src={URL.createObjectURL(file)} alt={file.name} />
                          <AvatarFallback className="bg-pink-100 text-pink-800 text-xs">
                            {file.name.slice(0, 4)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload Photos"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Successful!</DialogTitle>
            <DialogDescription>
              Thank you for sharing your photos with us. They will be added to our wedding gallery.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSuccess(false)}
            >
              Upload More Photos
            </Button>
            <Button 
              className="bg-pink-500 hover:bg-pink-600 text-white"
              asChild
            >
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
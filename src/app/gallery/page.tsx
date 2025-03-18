"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

// Sample photos data (in a real app, this would come from a database or API)
const samplePhotos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800",
    thumbnail: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=400",
    uploader: "Jennifer",
    title: "First Dance",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?q=80&w=800",
    thumbnail: "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?q=80&w=400",
    uploader: "Mike",
    title: "Ceremony Arch",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1525439541227-46e8fb7af883?q=80&w=800",
    thumbnail: "https://images.unsplash.com/photo-1525439541227-46e8fb7af883?q=80&w=400",
    uploader: "Sarah",
    title: "Wedding Cake",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800",
    thumbnail: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400",
    uploader: "Thomas",
    title: "Rings Exchange",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800",
    thumbnail: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400",
    uploader: "Lisa",
    title: "Wedding Bouquet",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800",
    thumbnail: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=400",
    uploader: "Robert",
    title: "Outdoor Setting",
  },
];

export default function GalleryPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof samplePhotos[0] | null>(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 inline-block">
            &larr; Back to Home
          </Link>
          <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white">
            <Link href="/upload">Upload More Photos</Link>
          </Button>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-pink-500 dark:text-pink-400 mb-6 text-center">
          Our Wedding Gallery
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-center mb-10 max-w-xl mx-auto">
          Browse through the beautiful moments captured during our special day
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {samplePhotos.map((photo) => (
            <Card 
              key={photo.id} 
              className="overflow-hidden cursor-pointer border-2 border-pink-200 dark:border-pink-800 transition-transform hover:scale-[1.02] shadow-lg"
              onClick={() => setSelectedPhoto(photo)}
            >
              <CardContent className="p-0 relative aspect-square">
                <Image
                  src={photo.thumbnail}
                  alt={photo.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                  <p className="font-semibold">{photo.title}</p>
                  <p className="text-xs">By {photo.uploader}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {samplePhotos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No photos have been uploaded yet.</p>
            <Button asChild className="bg-pink-500 hover:bg-pink-600 text-white">
              <Link href="/upload">Be the First to Upload</Link>
            </Button>
          </div>
        )}
      </div>
      
      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white dark:bg-slate-950">
          {selectedPhoto && (
            <>
              <div className="relative aspect-video w-full sm:aspect-auto sm:h-[60vh]">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                />
              </div>
              <DialogHeader className="p-4">
                <DialogTitle>{selectedPhoto.title}</DialogTitle>
                <DialogDescription>
                  Uploaded by {selectedPhoto.uploader}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 
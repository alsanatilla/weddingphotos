"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Share2, Heart, Music, Calendar, MapPin, Trash2, Cloud, CloudRain, Sun, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Wedding date
const WEDDING_DATE = new Date('2025-09-27T00:00:00');

// Wedding location (for weather)
const WEDDING_LOCATION = { city: "Berlin", country: "DE" };

// Love story timeline events
const LOVE_STORY = [
  { date: "05.08.2020", title: "Erstes Treffen", description: "Wir haben uns zum ersten Mal in einem Café getroffen." },
  { date: "15.09.2020", title: "Erstes Date", description: "Unser erstes richtiges Date im Stadtpark." },
  { date: "24.12.2020", title: "Verliebte Weihnachten", description: "Unser erstes gemeinsames Weihnachtsfest." },
  { date: "14.02.2022", title: "Zusammenziehen", description: "Wir haben unsere erste gemeinsame Wohnung bezogen." },
  { date: "20.10.2023", title: "Verlobung", description: "Atilla hat Selinay während des Sonnenuntergangs am Strand einen Antrag gemacht." },
  { date: "27.09.2025", title: "Hochzeit", description: "Der Tag, an dem wir uns das Ja-Wort geben!" },
];

// Romantic quotes
const ROMANTIC_QUOTES = [
  "Liebe ist nicht das, was man erwartet zu bekommen, sondern das, was man bereit ist zu geben.",
  "In deinen Armen zu sein ist mein Lieblingsplatz auf der Welt.",
  "Ich liebe dich nicht nur für das, was du bist, sondern für das, was ich bin, wenn ich bei dir bin.",
  "Mit dir zusammen sind selbst die gewöhnlichsten Dinge außergewöhnlich.",
  "Du bist mein heute und alle meine Morgen.",
  "Deine Liebe ist der Rhythmus meines Herzens.",
  "Meine Seele und deine Seele sind für immer verbunden.",
];

// Guest list data
const GUEST_CATEGORIES = [
  { 
    name: "Selis Freunde", 
    count: 30, 
    guests: [
      "Selin", "Murat", "Laura", "Fabian", "Marisa +1", "Sevil", "Selin", "Rinesa", 
      "Beni", "Matthias", "Victoria", "Kind", "Valentin", "Laura", "Verena", "Ramona", 
      "Fido", "Hannah +1", "Rinesa Mama", "Papa", "Bruder", "Leotrim", "Gerhard", 
      "Monika", "Geert", "Stephanie Katz"
    ] 
  },
  { 
    name: "Familie Baba", 
    count: 21, 
    guests: [
      "Hala 10", "Tülay 8", "Senol 3", "Babaanne"
    ] 
  },
  { 
    name: "Mama Familie", 
    count: 25, 
    guests: [
      "Yasemin 10", "Rukiye 4", "Ömer 5", "Zeliha 6", "Semra", "Anneanne"
    ] 
  },
  { 
    name: "Familienfreunde", 
    count: 34, 
    guests: [
      "Barsans 8", "Memduh 5", "Yalcin und Franzi", "Nida 5", "Özlem 6", 
      "Nur und Süleyman", "Gülcan 4", "Bülent Hasret"
    ] 
  },
  { 
    name: "Baba Arbeit", 
    count: 20, 
    guests: [
      "Simon Frau Kind", "Tobi Frau", "Astrid Frau", "Eda Mann", "Dietmar Frau Sohn",
      "Kemo", "Gerhard Frau", "Robin Frau"
    ] 
  },
  { 
    name: "Türkei", 
    count: 10, 
    guests: [
      "Gizem Fatih", "Babaanne", "Anneanne", "Döne Teyze", "Aysel Teyze", "Tugce Hakan"
    ] 
  }
];

// Table seating data
const SEATING_PLAN = [
  { 
    table: 1, 
    name: "Brautpaar & Eltern", 
    seats: ["Braut", "Bräutigam", "Brauteltern", "Bräutigameltern", "Geschwister der Braut", "Geschwister des Bräutigams"]
  },
  { 
    table: 2, 
    name: "Selis Freunde 1", 
    seats: [
      "Selin", "Murat", "Laura", "Fabian", "Marisa +1", "Sevil", "Rinesa", 
      "Beni", "Matthias", "Victoria", "Kind", "Valentin", "Laura"
    ]
  },
  { 
    table: 3, 
    name: "Selis Freunde 2", 
    seats: [
      "Verena", "Ramona", "Fido", "Hannah +1", "Rinesa Mama", "Papa", "Bruder", 
      "Leotrim", "Gerhard", "Monika", "Geert", "Stephanie Katz"
    ]
  },
  { 
    table: 4, 
    name: "Familie Baba", 
    seats: [
      "Hala (10 Personen)", "Tülay (8 Personen)", "Senol (3 Personen)", "Babaanne"
    ]
  },
  { 
    table: 5, 
    name: "Mama Familie", 
    seats: [
      "Yasemin (10 Personen)", "Rukiye (4 Personen)", "Ömer (5 Personen)", 
      "Zeliha (6 Personen)", "Semra", "Anneanne"
    ]
  },
  { 
    table: 6, 
    name: "Familienfreunde 1", 
    seats: [
      "Barsans (8 Personen)", "Memduh (5 Personen)", "Yalcin und Franzi"
    ]
  },
  { 
    table: 7, 
    name: "Familienfreunde 2", 
    seats: [
      "Nida (5 Personen)", "Özlem (6 Personen)", "Nur und Süleyman", 
      "Gülcan (4 Personen)", "Bülent Hasret"
    ]
  },
  { 
    table: 8, 
    name: "Baba Arbeit", 
    seats: [
      "Simon Frau Kind", "Tobi Frau", "Astrid Frau", "Eda Mann", 
      "Dietmar Frau Sohn", "Kemo", "Gerhard Frau", "Robin Frau"
    ]
  },
  { 
    table: 9, 
    name: "Türkei Gäste 1", 
    seats: [
      "Gizem Fatih", "Babaanne", "Anneanne"
    ]
  },
  { 
    table: 10, 
    name: "Türkei Gäste 2", 
    seats: [
      "Döne Teyze", "Aysel Teyze", "Tugce Hakan"
    ]
  }
];

// Photo filters
const PHOTO_FILTERS = [
  { id: "original", name: "Original" },
  { id: "sepia", name: "Sepia" },
  { id: "grayscale", name: "Schwarz & Weiß" },
  { id: "vintage", name: "Vintage" },
  { id: "hearts", name: "Herzen" },
  { id: "love", name: "Liebe" },
];

// Photo schema and type
interface StoredPhoto {
  id: number;
  url: string;
  thumbnail: string;
  uploader: string;
  title: string;
  dateUploaded: string;
  likes: string[]; // Names of people who liked the photo
  filter: string;
}

// Guestbook entry type
interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  date: string;
  likes: string[]; // Names of people who liked the entry
}

// Music request type
interface MusicRequest {
  id: number;
  songTitle: string;
  artist: string;
  requestedBy: string;
  date: string;
  votes: string[]; // Names of people who voted for the song
}

// Use a more SSR-friendly schema definition
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name muss mindestens 2 Zeichen lang sein.",
  }),
  email: z.string().email({
    message: "Bitte gib eine gültige E-Mail-Adresse ein.",
  }),
  // Using any type for photos to avoid FileList reference which is browser-only
  photos: z.any().refine((value) => {
    // Only validate in browser environment to avoid SSR issues
    if (typeof window !== "undefined") {
      return value && value.length > 0;
    }
    return true; // Skip validation during SSR
  }, {
    message: "Bitte wähle mindestens ein Foto aus.",
  }),
  message: z.string().optional(),
});

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Weather interface
interface WeatherForecast {
  date: string;
  temp: number;
  description: string;
  icon: string;
  loading: boolean;
  error: string | null;
}

export default function Home() {
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<StoredPhoto | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [userName, setUserName] = useState("");
  const [showHearts, setShowHearts] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("original");
  const [randomQuote, setRandomQuote] = useState("");
  const [weatherForecast, setWeatherForecast] = useState<WeatherForecast>({
    date: "",
    temp: 0,
    description: "",
    icon: "",
    loading: true,
    error: null
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  // Guestbook state
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);
  const [guestMessage, setGuestMessage] = useState("");
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  // Music requests state
  const [musicRequests, setMusicRequests] = useState<MusicRequest[]>([]);
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [isSubmittingSong, setIsSubmittingSong] = useState(false);
  // Seating plan state
  const [searchName, setSearchName] = useState("");
  const [foundTable, setFoundTable] = useState<number | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(1);
  // Guest list state
  const [selectedCategory, setSelectedCategory] = useState<string>(GUEST_CATEGORIES[0].name);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    // Ensure we only run on client-side to avoid SSR issues
    if (typeof window !== "undefined") {
      try {
        const storedPhotos = localStorage.getItem('weddingPhotos');
        if (storedPhotos) {
          setPhotos(JSON.parse(storedPhotos));
        }
        
        // Try to load the user's name from localStorage
        const storedName = localStorage.getItem('userName');
        if (storedName) {
          setUserName(storedName);
        }

        // Load guestbook entries
        const storedEntries = localStorage.getItem('weddingGuestbook');
        if (storedEntries) {
          setGuestbookEntries(JSON.parse(storedEntries));
        }

        // Load music requests
        const storedRequests = localStorage.getItem('weddingMusicRequests');
        if (storedRequests) {
          setMusicRequests(JSON.parse(storedRequests));
        }

        // Set a random romantic quote
        setRandomQuote(ROMANTIC_QUOTES[Math.floor(Math.random() * ROMANTIC_QUOTES.length)]);
      } catch (error) {
        console.error("Error loading from localStorage:", error);
      }
    }
  }, []);

  // Fetch weather forecast for wedding date
  useEffect(() => {
    const fetchWeather = async () => {
      if (typeof window === "undefined") return;
      
      try {
        setWeatherForecast(prev => ({ ...prev, loading: true, error: null }));
        
        // For demo purposes, we'll simulate a weather forecast
        // In a real app, you would call a weather API like OpenWeatherMap
        setTimeout(() => {
          // Generate random weather data (since this is a future date)
          const weatherOptions = [
            { temp: Math.floor(Math.random() * 10) + 15, description: "Sonnig", icon: "sun" },
            { temp: Math.floor(Math.random() * 5) + 10, description: "Leicht bewölkt", icon: "cloud" },
            { temp: Math.floor(Math.random() * 5) + 10, description: "Regnerisch", icon: "cloud-rain" },
          ];
          
          const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
          
          setWeatherForecast({
            date: new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(WEDDING_DATE),
            temp: randomWeather.temp,
            description: randomWeather.description,
            icon: randomWeather.icon,
            loading: false,
            error: null
          });
        }, 1500);
        
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeatherForecast(prev => ({
          ...prev,
          loading: false,
          error: "Wettervorhersage konnte nicht geladen werden."
        }));
      }
    };
    
    fetchWeather();
  }, []);

  // Rotate quotes every 20 seconds
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setRandomQuote(ROMANTIC_QUOTES[Math.floor(Math.random() * ROMANTIC_QUOTES.length)]);
    }, 20000);

    return () => clearInterval(quoteInterval);
  }, []);

  // Create floating hearts animation effect for 3 seconds
  useEffect(() => {
    if (showHearts) {
      const timer = setTimeout(() => {
        setShowHearts(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showHearts]);

  // Update the countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = WEDDING_DATE.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setCountdown({ days, hours, minutes, seconds });
      }
    };
    
    // Update immediately
    updateCountdown();
    
    // Then update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userName || "",
      email: "",
      message: "",
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      form.setValue("photos", e.target.files);
    }
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedFiles.length === 0) {
      alert("Bitte wähle mindestens ein Foto aus.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Process files in parallel
      const processedPhotos = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const base64 = await fileToBase64(file);
          return {
            id: Date.now() + index, // Unique ID based on timestamp
            url: base64,
            thumbnail: base64,
            uploader: values.name,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            dateUploaded: new Date().toISOString(),
            likes: [],
            filter: selectedFilter,
          };
        })
      );
      
      // Update state and localStorage
      const updatedPhotos = [...processedPhotos, ...photos];
      setPhotos(updatedPhotos);
      try {
        localStorage.setItem('weddingPhotos', JSON.stringify(updatedPhotos));
        // Remember the user's name for next time
        localStorage.setItem('userName', values.name);
        setUserName(values.name);
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        alert("Deine Fotos wurden hochgeladen, konnten aber nicht gespeichert werden. Bitte stelle sicher, dass dein Browser Cookies und LocalStorage unterstützt.");
      }
      
      setShowSuccess(true);
      form.reset();
      form.setValue("name", values.name); // Keep the name for next upload
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error processing uploads:", error);
      alert("Beim Hochladen deiner Fotos ist ein Fehler aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsUploading(false);
    }
  }
  
  const clearAllPhotos = () => {
    if (confirm("Bist du sicher, dass du alle Fotos löschen möchtest? Das kann nicht rückgängig gemacht werden.")) {
      try {
        localStorage.removeItem('weddingPhotos');
        setPhotos([]);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
        alert("Fehler beim Löschen der Fotos. Bitte versuche es erneut.");
      }
    }
  };
  
  const deletePhoto = (photoId: number) => {
    // Close any confirmation dialogs
    setShowDeleteConfirm(null);
    
    // Remove the photo from the array
    const updatedPhotos = photos.filter(photo => photo.id !== photoId);
    setPhotos(updatedPhotos);
    
    // If the selected photo is being deleted, close the detail view
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto(null);
    }
    
    // Update localStorage
    try {
      localStorage.setItem('weddingPhotos', JSON.stringify(updatedPhotos));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };
  
  const handleLike = (photoId: number) => {
    if (!userName) {
      alert("Bitte gib deinen Namen ein, um Fotos zu liken.");
      return;
    }

    setShowHearts(true); // Show heart animation
    
    const updatedPhotos = photos.map(photo => {
      if (photo.id === photoId) {
        const hasLiked = photo.likes.includes(userName);
        if (hasLiked) {
          // Unlike
          return {
            ...photo,
            likes: photo.likes.filter(name => name !== userName)
          };
        } else {
          // Like
          return {
            ...photo,
            likes: [...photo.likes, userName]
          };
        }
      }
      return photo;
    });
    
    setPhotos(updatedPhotos);
    
    if (selectedPhoto && selectedPhoto.id === photoId) {
      const updatedSelectedPhoto = updatedPhotos.find(p => p.id === photoId);
      if (updatedSelectedPhoto) {
        setSelectedPhoto(updatedSelectedPhoto);
      }
    }
    
    try {
      localStorage.setItem('weddingPhotos', JSON.stringify(updatedPhotos));
    } catch (error) {
      console.error("Error saving likes to localStorage:", error);
    }
  };
  
  const handleShare = async (photoUrl: string, title: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: 'Hochzeitsfoto von Selinay & Atilla',
            text: `Schau dir dieses Foto von Selinay & Atillas Hochzeit an: ${title}`,
            // In a real app, you'd provide a shareable URL instead of the base64 data
            url: window.location.href,
          });
        } catch (error) {
          console.log('Teilen abgebrochen');
        }
      } else {
        // Fallback for browsers that don't support Web Share API
        try {
          navigator.clipboard.writeText(window.location.href);
          alert('Link wurde in die Zwischenablage kopiert. Du kannst ihn jetzt teilen.');
        } catch (err) {
          alert('Teilen wird von deinem Browser nicht unterstützt. Bitte kopiere den Link manuell.');
        }
      }
    } catch (error) {
      console.error("Error sharing:", error);
      alert('Teilen wird von deinem Browser nicht unterstützt. Bitte kopiere den Link manuell.');
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const getFilterStyle = (filter: string) => {
    switch(filter) {
      case "sepia":
        return "sepia(0.8)";
      case "grayscale":
        return "grayscale(1)";
      case "vintage":
        return "sepia(0.4) contrast(0.85) brightness(0.9)";
      case "hearts":
        return "brightness(1.05) contrast(0.95)";
      case "love":
        return "brightness(1.05) contrast(0.95) saturate(1.3)";
      default:
        return "none";
    }
  };

  // Function to get the weather icon component
  const getWeatherIcon = (iconName: string) => {
    switch(iconName) {
      case "sun":
        return <Sun className="text-yellow-500" />;
      case "cloud":
        return <Cloud className="text-gray-400" />;
      case "cloud-rain":
        return <CloudRain className="text-blue-400" />;
      default:
        return <Cloud className="text-gray-400" />;
    }
  };

  // Function to generate floating hearts
  const FloatingHearts = () => {
    if (!showHearts) return null;
    
    const hearts = Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const animDuration = Math.random() * 3 + 2;
      const delay = Math.random() * 0.5;
      
      return (
        <div
          key={i}
          className="absolute z-50 text-pink-500"
          style={{
            left: `${left}%`,
            bottom: '0%',
            fontSize: `${size}px`,
            animation: `float ${animDuration}s ease-in ${delay}s forwards`,
            opacity: 0,
          }}
        >
          ❤️
        </div>
      );
    });
    
    return <div className="fixed inset-0 pointer-events-none overflow-hidden">{hearts}</div>;
  };
  
  const handleLikeGuestbookEntry = (entryId: number) => {
    if (!userName) {
      alert("Bitte gib deinen Namen ein, um Einträge zu liken.");
      return;
    }

    setShowHearts(true); // Show heart animation
    
    const updatedEntries = guestbookEntries.map(entry => {
      if (entry.id === entryId) {
        const hasLiked = entry.likes.includes(userName);
        if (hasLiked) {
          // Unlike
          return {
            ...entry,
            likes: entry.likes.filter(name => name !== userName)
          };
        } else {
          // Like
          return {
            ...entry,
            likes: [...entry.likes, userName]
          };
        }
      }
      return entry;
    });
    
    setGuestbookEntries(updatedEntries);
    
    try {
      localStorage.setItem('weddingGuestbook', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error("Error saving likes to localStorage:", error);
    }
  };
  
  const submitGuestbookEntry = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName) {
      alert("Bitte gib deinen Namen ein, um einen Eintrag zu hinterlassen.");
      return;
    }
    
    if (!guestMessage.trim()) {
      alert("Bitte gib eine Nachricht ein.");
      return;
    }
    
    setIsSubmittingMessage(true);
    
    try {
      const newEntry: GuestbookEntry = {
        id: Date.now(),
        name: userName,
        message: guestMessage,
        date: new Date().toISOString(),
        likes: []
      };
      
      const updatedEntries = [newEntry, ...guestbookEntries];
      setGuestbookEntries(updatedEntries);
      
      localStorage.setItem('weddingGuestbook', JSON.stringify(updatedEntries));
      localStorage.setItem('userName', userName);
      
      setGuestMessage("");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving guestbook entry:", error);
      alert("Beim Speichern deines Eintrags ist ein Fehler aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsSubmittingMessage(false);
    }
  };
  
  const deleteGuestbookEntry = (entryId: number) => {
    if (confirm("Möchtest du diesen Eintrag wirklich löschen?")) {
      const updatedEntries = guestbookEntries.filter(entry => entry.id !== entryId);
      setGuestbookEntries(updatedEntries);
      
      try {
        localStorage.setItem('weddingGuestbook', JSON.stringify(updatedEntries));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  };
  
  // Function to handle submitting a music request
  const submitMusicRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName) {
      alert("Bitte gib deinen Namen ein, um einen Song vorzuschlagen.");
      return;
    }
    
    if (!newSongTitle.trim() || !newArtist.trim()) {
      alert("Bitte gib Songtitel und Interpret ein.");
      return;
    }
    
    setIsSubmittingSong(true);
    
    try {
      const newRequest: MusicRequest = {
        id: Date.now(),
        songTitle: newSongTitle,
        artist: newArtist,
        requestedBy: userName,
        date: new Date().toISOString(),
        votes: [userName] // Automatically vote for your own request
      };
      
      const updatedRequests = [newRequest, ...musicRequests];
      setMusicRequests(updatedRequests);
      
      localStorage.setItem('weddingMusicRequests', JSON.stringify(updatedRequests));
      localStorage.setItem('userName', userName);
      
      setNewSongTitle("");
      setNewArtist("");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving music request:", error);
      alert("Beim Speichern deines Musikwunsches ist ein Fehler aufgetreten. Bitte versuche es erneut.");
    } finally {
      setIsSubmittingSong(false);
    }
  };
  
  // Function to vote for a music request
  const voteMusicRequest = (requestId: number) => {
    if (!userName) {
      alert("Bitte gib deinen Namen ein, um für Songs abzustimmen.");
      return;
    }

    setShowHearts(true); // Show heart animation
    
    const updatedRequests = musicRequests.map(request => {
      if (request.id === requestId) {
        const hasVoted = request.votes.includes(userName);
        if (hasVoted) {
          // Remove vote
          return {
            ...request,
            votes: request.votes.filter(name => name !== userName)
          };
        } else {
          // Add vote
          return {
            ...request,
            votes: [...request.votes, userName]
          };
        }
      }
      return request;
    });
    
    setMusicRequests(updatedRequests);
    
    try {
      localStorage.setItem('weddingMusicRequests', JSON.stringify(updatedRequests));
    } catch (error) {
      console.error("Error saving votes to localStorage:", error);
    }
  };
  
  // Function to search for a guest in the seating plan
  const searchSeating = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchName.trim()) {
      setFoundTable(null);
      return;
    }
    
    const searchTerm = searchName.toLowerCase().trim();
    
    // Search through all tables and seats
    for (const table of SEATING_PLAN) {
      const found = table.seats.some(
        seat => seat.toLowerCase().includes(searchTerm)
      );
      
      if (found) {
        setFoundTable(table.table);
        setSelectedTable(table.table);
        return;
      }
    }
    
    // If no match found
    alert(`Kein Gast mit Namen "${searchName}" gefunden. Bitte überprüfe die Schreibweise oder frage die Gastgeber.`);
    setFoundTable(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-slate-950 dark:to-slate-900">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(-100vh) rotate(20deg); opacity: 0; }
        }
        
        .photo-frame-hearts::before {
          content: "❤️";
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 20px;
          z-index: 10;
        }
        
        .photo-frame-hearts::after {
          content: "❤️";
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-size: 20px;
          z-index: 10;
        }
        
        .vintage-border {
          box-shadow: inset 0 0 0 10px rgba(255, 182, 193, 0.3);
        }

        .table-circle {
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .table-circle:hover {
          transform: scale(1.05);
        }
        
        .table-circle.selected {
          box-shadow: 0 0 0 3px #ec4899, 0 0 15px rgba(236, 72, 153, 0.5);
        }
        
        .category-pill {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .category-pill:hover {
          transform: translateY(-2px);
        }
        
        .category-pill.selected {
          background-color: #ec4899;
          color: white;
        }
      `}</style>
      
      <FloatingHearts />
      
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-pink-500 dark:text-pink-400 mb-2 md:mb-4">
            Selinay & Atilla
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-2">
            Hilf uns, besondere Momente unserer Hochzeit festzuhalten
          </p>
          <p className="text-2xl font-semibold text-pink-600 dark:text-pink-400 mb-4">
            27.09.2025
          </p>
          
          {/* Random Love Quote */}
          <div className="italic text-pink-600 dark:text-pink-300 max-w-lg mx-auto mb-6 px-4 py-2 bg-pink-50 dark:bg-pink-950/30 rounded-lg">
            "{randomQuote}"
          </div>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-2 md:gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-2 md:p-3 rounded-lg shadow-md text-center min-w-12 md:min-w-16">
              <div className="text-xl md:text-3xl font-bold text-pink-500">{countdown.days}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">TAGE</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 md:p-3 rounded-lg shadow-md text-center min-w-12 md:min-w-16">
              <div className="text-xl md:text-3xl font-bold text-pink-500">{countdown.hours}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">STD</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 md:p-3 rounded-lg shadow-md text-center min-w-12 md:min-w-16">
              <div className="text-xl md:text-3xl font-bold text-pink-500">{countdown.minutes}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">MIN</div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-2 md:p-3 rounded-lg shadow-md text-center min-w-12 md:min-w-16">
              <div className="text-xl md:text-3xl font-bold text-pink-500">{countdown.seconds}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">SEK</div>
            </div>
          </div>
        </header>
        
        <Tabs defaultValue="gallery" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="gallery">Galerie</TabsTrigger>
            <TabsTrigger value="upload">Fotos hochladen</TabsTrigger>
            <TabsTrigger value="guestbook">Gästebuch</TabsTrigger>
            <TabsTrigger value="info">Infos</TabsTrigger>
            <TabsTrigger value="musik-gaeste">Musik & Gäste</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            {/* Upload Section */}
            <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg mb-8 md:mb-12 max-w-2xl mx-auto">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl md:text-2xl text-center">Fotos hochladen</CardTitle>
                <CardDescription className="text-center">
                  Teile deine Lieblingsmomente von unserer Hochzeit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dein Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Gib deinen Namen ein" {...field} />
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
                            <FormLabel>Deine E-Mail</FormLabel>
                            <FormControl>
                              <Input placeholder="Gib deine E-Mail ein" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="photos"
                      render={() => (
                        <FormItem>
                          <FormLabel>Fotos auswählen</FormLabel>
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
                      <>
                        <div>
                          <Label>Ausgewählte Fotos ({selectedFiles.length})</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedFiles.map((file, index) => (
                              <Avatar key={index} className="h-14 w-14 md:h-16 md:w-16">
                                <AvatarImage src={URL.createObjectURL(file)} alt={file.name} />
                                <AvatarFallback className="bg-pink-100 text-pink-800 text-xs">
                                  {file.name.slice(0, 4)}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label>Filter auswählen</Label>
                          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Wähle einen Filter" />
                            </SelectTrigger>
                            <SelectContent>
                              {PHOTO_FILTERS.map(filter => (
                                <SelectItem key={filter.id} value={filter.id}>
                                  {filter.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deine Nachricht (optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Füge eine kurze Nachricht hinzu..." 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                      disabled={isUploading}
                    >
                      {isUploading ? "Wird hochgeladen..." : "Fotos hochladen"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery">
            {/* Gallery Section */}
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-pink-500 dark:text-pink-400 text-center mb-3 sm:mb-0">
                  Unsere Hochzeitsgalerie
                </h2>
                {photos.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={clearAllPhotos}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    size="sm"
                  >
                    Alle Fotos löschen
                  </Button>
                )}
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-center mb-8 md:mb-10 max-w-xl mx-auto">
                Durchstöbere die schönen Momente unseres besonderen Tages
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {photos.map((photo) => (
                  <Card 
                    key={photo.id} 
                    className="overflow-hidden cursor-pointer border-2 border-pink-200 dark:border-pink-800 transition-transform hover:scale-[1.02] shadow-lg"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <CardContent className="p-0 relative aspect-square">
                      <div className="relative w-full h-full">
                        {/* Using a div with background image for base64 instead of Next.js Image component */}
                        <div 
                          className={`absolute inset-0 bg-cover bg-center ${photo.filter === "hearts" ? "photo-frame-hearts" : ""} ${photo.filter === "love" ? "vintage-border" : ""}`}
                          style={{ 
                            backgroundImage: `url(${photo.url})`,
                            filter: getFilterStyle(photo.filter)
                          }}
                        />
                      </div>
                      <div className="absolute top-2 right-2">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(photo.id);
                          }}
                          className="p-1.5 bg-black/50 rounded-full text-white hover:bg-red-500/80 transition-colors"
                          aria-label="Foto löschen"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                        <p className="font-semibold">{photo.title}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs">Von {photo.uploader}</p>
                          <div className="flex space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(photo.id);
                              }}
                              className={`${photo.likes.includes(userName) ? "text-pink-400" : "text-white"} hover:text-pink-300`}
                              aria-label="Mag ich"
                            >
                              <Heart size={16} fill={photo.likes.includes(userName) ? "#f472b6" : "none"} />
                              {photo.likes.length > 0 && (
                                <span className="text-xs ml-1">{photo.likes.length}</span>
                              )}
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(photo.url, photo.title);
                              }}
                              className="text-white hover:text-pink-300"
                              aria-label="Teilen"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {photos.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-500 dark:text-slate-400 mb-4">Es wurden noch keine Fotos hochgeladen.</p>
                  <Button 
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                    onClick={() => {
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.click();
                    }}
                  >
                    Sei der Erste, der Fotos hochlädt
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="guestbook">
            {/* Guestbook Section */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-pink-500 dark:text-pink-400 text-center mb-4">
                Unser Gästebuch
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-center mb-8 max-w-xl mx-auto">
                Hinterlasse uns einen Eintrag, den wir für immer in Erinnerung behalten können
              </p>
              
              {/* New entry form */}
              <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg mb-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Deine Nachricht</CardTitle>
                  <CardDescription>
                    Hinterlasse deine Glückwünsche, Ratschläge oder Grüße
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={submitGuestbookEntry} className="space-y-4">
                    <div>
                      <Label htmlFor="guestbook-name">Dein Name</Label>
                      <Input 
                        id="guestbook-name" 
                        value={userName} 
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Dein Name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guestbook-message">Deine Nachricht</Label>
                      <textarea 
                        id="guestbook-message"
                        value={guestMessage}
                        onChange={(e) => setGuestMessage(e.target.value)}
                        placeholder="Schreibe hier deine Nachricht..."
                        required
                        className="w-full min-h-[120px] px-3 py-2 text-base border-2 border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-slate-800 dark:text-slate-200"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                      disabled={isSubmittingMessage}
                    >
                      {isSubmittingMessage ? "Wird gespeichert..." : "Eintrag hinterlassen"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Guestbook entries */}
              <div className="space-y-4">
                {guestbookEntries.length > 0 ? (
                  guestbookEntries.map((entry) => (
                    <Card key={entry.id} className="border-2 border-pink-100 dark:border-pink-900 shadow-md transition-transform hover:scale-[1.01]">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback className="bg-pink-100 text-pink-800">
                                {entry.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{entry.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatDate(entry.date)}
                              </p>
                            </div>
                          </div>
                          
                          {userName === entry.name && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-slate-500 hover:text-red-500"
                              onClick={() => deleteGuestbookEntry(entry.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                        
                        <div className="pl-12 mb-4">
                          <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                            {entry.message}
                          </p>
                        </div>
                        
                        <div className="pl-12 flex items-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className={`flex items-center gap-1 p-1 ${entry.likes.includes(userName) ? 'text-pink-500' : 'text-slate-500'}`}
                            onClick={() => handleLikeGuestbookEntry(entry.id)}
                          >
                            <Heart size={16} fill={entry.likes.includes(userName) ? "#f472b6" : "none"} />
                            <span className="text-xs">
                              {entry.likes.length > 0 && entry.likes.length}
                            </span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">
                      Sei der Erste, der einen Eintrag hinterlässt!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="info">
            {/* Wedding Information */}
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-pink-500 dark:text-pink-400 text-center mb-8">
                Hochzeitsinformationen
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-md border-pink-200 dark:border-pink-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-pink-600 dark:text-pink-400 flex items-center gap-2">
                      <MapPin size={18} /> Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Schlappinger Hof</p>
                    <p className="text-slate-600 dark:text-slate-300">Reisbach in Niederbayern</p>
                    <div className="mt-4">
                      <a 
                        href="https://maps.google.com/?q=Schlappinger+Hof+Reisbach+Niederbayern" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:text-pink-600 text-sm flex items-center gap-1"
                      >
                        In Google Maps öffnen
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                      </a>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-pink-200 dark:border-pink-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-pink-600 dark:text-pink-400 flex items-center gap-2">
                      <Calendar size={18} /> Zeitplan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Beginn der Feier</p>
                        <p className="text-slate-600 dark:text-slate-300">16:00 Uhr</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Empfang</p>
                        <p className="text-slate-600 dark:text-slate-300">16:30 Uhr</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Abendessen</p>
                        <p className="text-slate-600 dark:text-slate-300">18:00 Uhr</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-pink-200 dark:border-pink-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-pink-600 dark:text-pink-400 flex items-center gap-2">
                      {weatherForecast.icon === "sun" ? (
                        <Sun size={18} className="text-yellow-500" />
                      ) : weatherForecast.icon === "cloud-rain" ? (
                        <CloudRain size={18} className="text-blue-400" />
                      ) : (
                        <Cloud size={18} className="text-gray-400" />
                      )} Wettervorhersage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {weatherForecast.loading ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="animate-spin text-pink-500" size={20} />
                        <span className="text-slate-600 dark:text-slate-300">Wettervorhersage wird geladen...</span>
                      </div>
                    ) : weatherForecast.error ? (
                      <span className="text-red-500">{weatherForecast.error}</span>
                    ) : (
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200">27.09.2025</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-lg font-medium text-pink-500">{weatherForecast.temp}°C</span>
                            <span className="text-slate-600 dark:text-slate-300">{weatherForecast.description}</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 italic">
                          Da der Wetterbericht ein Jahr im Voraus nicht zuverlässig ist, ist dies eine Simulation. Aktuelle Daten werden näher am Hochzeitstag verfügbar sein.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-pink-200 dark:border-pink-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-pink-600 dark:text-pink-400 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path><line x1="6" x2="18" y1="17" y2="17"></line></svg> Menü
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 font-medium">Buffet</p>
                    
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="font-medium text-pink-600 dark:text-pink-400">Vorspeisen</h4>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 pl-2 mt-1 space-y-1">
                          <li>Suppe des Tages</li>
                          <li>Tomate-Mozzarella mit Basilikum</li>
                          <li>Käseauswahl mit Trauben und Feigen</li>
                          <li>Gemischter Salat mit Hausdressing</li>
                          <li>Antipasti-Platte mit mediterranem Gemüse</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-pink-600 dark:text-pink-400">Hauptspeisen</h4>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 pl-2 mt-1 space-y-1">
                          <li>Hausgemachte Käsespätzle mit Röstzwiebeln</li>
                          <li>Zartes Rinderbratenstück mit Rotweinsauce</li>
                          <li>Gebratener Lachs mit Zitronenbutter</li>

                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-pink-600 dark:text-pink-400">Nachspeisen</h4>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 pl-2 mt-1 space-y-1">
                          <li>Saftiger Schokokuchen</li>
                          <li>Soufflé mit Vanillesauce</li>
                          <li>Hochzeitstorte (wird am Abend serviert)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-pink-600 dark:text-pink-400">Getränke</h4>
                        <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 pl-2 mt-1 space-y-1">
                          <li>Alkoholfreie Getränke</li>
                          <li>Kaffee und Tee</li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 mt-4">Bei besonderen Ernährungsbedürfnissen oder Allergien kontaktiere uns bitte im Voraus.</p>
                  </CardContent>
                </Card>
                
                <Card className="shadow-md border-pink-200 dark:border-pink-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-pink-600 dark:text-pink-400 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><circle cx="12" cy="12" r="1"></circle><path d="M7.05 7.05A7 7 0 1 0 17 17"></path></svg> Weitere Informationen
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Dresscode</p>
                        <p className="text-slate-600 dark:text-slate-300">Festlich (nicht zu förmlich)</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Parken</p>
                        <p className="text-slate-600 dark:text-slate-300">Kostenlose Parkplätze sind vorhanden</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">Übernachtung</p>
                        <p className="text-slate-600 dark:text-slate-300">Unterkünfte sind in der Nähe verfügbar</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-12">
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  Wir freuen uns darauf, diesen besonderen Tag mit euch zu teilen!
                </p>
                <Button 
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Fotos hochladen
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="musik-gaeste">
            {/* Music & Guests Section */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-pink-500 dark:text-pink-400 text-center mb-6">
                Musik & Gäste
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Spotify Playlist */}
                <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0"></path><path d="M8 12a4 4 0 0 1 8 0"></path><path d="M9 9.67a6 6 0 0 1 6 0"></path></svg>
                      Unsere Playlist
                    </CardTitle>
                    <CardDescription>
                      Vorab eine kleine Kostprobe der Musik, die dich auf unserer Hochzeit erwartet.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-black rounded-md overflow-hidden">
                      <iframe 
                        src="https://open.spotify.com/embed/playlist/37i9dQZF1DXa2PvUpywmrr" 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        allow="encrypted-media"
                        className="rounded-md"
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Music Requests */}
                <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Music size={20} />
                      Musikwünsche
                    </CardTitle>
                    <CardDescription>
                      Welchen Song sollen wir für dich spielen? Stimme auch für andere Vorschläge ab!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <form onSubmit={submitMusicRequest} className="space-y-3">
                        <div>
                          <Label htmlFor="requester-name">Dein Name</Label>
                          <Input 
                            id="requester-name" 
                            value={userName} 
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Dein Name"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="song-title">Songtitel</Label>
                          <Input 
                            id="song-title"
                            value={newSongTitle}
                            onChange={(e) => setNewSongTitle(e.target.value)}
                            placeholder="z.B. Can't Help Falling in Love"
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="song-artist">Interpret</Label>
                          <Input 
                            id="song-artist"
                            value={newArtist}
                            onChange={(e) => setNewArtist(e.target.value)}
                            placeholder="z.B. Elvis Presley"
                            required
                            className="mt-1"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                          disabled={isSubmittingSong}
                        >
                          {isSubmittingSong ? "Wird gespeichert..." : "Song vorschlagen"}
                        </Button>
                      </form>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto pr-2 mt-4">
                      <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Vorgeschlagene Songs ({musicRequests.length})
                      </h4>
                      
                      {musicRequests.length > 0 ? (
                        <div className="space-y-3">
                          {musicRequests
                            .sort((a, b) => b.votes.length - a.votes.length)
                            .map((request) => (
                              <div 
                                key={request.id}
                                className="border border-pink-100 dark:border-pink-900 rounded-lg p-3 bg-white dark:bg-slate-800 shadow-sm"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-slate-800 dark:text-slate-200">
                                      {request.songTitle}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                      {request.artist}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                      Vorgeschlagen von {request.requestedBy}
                                    </p>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className={`flex items-center gap-1 ${request.votes.includes(userName) ? 'text-pink-500' : 'text-slate-500'}`}
                                    onClick={() => voteMusicRequest(request.id)}
                                  >
                                    <Heart size={16} fill={request.votes.includes(userName) ? "#f472b6" : "none"} />
                                    <span className="ml-1">{request.votes.length}</span>
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                          Noch keine Songvorschläge. Sei der Erste!
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {/* Seating Plan with Guest List */}
                <Card className="border-2 border-pink-200 dark:border-pink-800 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      Gästeliste & Sitzplan
                    </CardTitle>
                    <CardDescription>
                      Insgesamt {GUEST_CATEGORIES.reduce((acc, cat) => acc + cat.count, 0)} Gäste für unsere Hochzeit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Gästeliste */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {GUEST_CATEGORIES.map((category) => (
                          <div
                            key={category.name}
                            className={`category-pill px-3 py-1.5 rounded-full text-sm font-medium border ${
                              selectedCategory === category.name
                                ? 'selected border-pink-500'
                                : 'bg-white dark:bg-slate-800 border-pink-200 dark:border-pink-800 text-slate-700 dark:text-slate-300'
                            }`}
                            onClick={() => setSelectedCategory(category.name)}
                          >
                            {category.name} ({category.count})
                          </div>
                        ))}
                      </div>
                      
                      {GUEST_CATEGORIES.map((category) => (
                        selectedCategory === category.name && (
                          <div key={category.name} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-pink-200 dark:border-pink-900 mb-6">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-medium text-pink-600 dark:text-pink-400">
                                {category.name}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                {category.count} Personen
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {category.guests.map((guest, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-3 py-1.5 rounded-md text-sm bg-pink-50 dark:bg-pink-900/20 text-slate-700 dark:text-slate-300"
                                >
                                  {guest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                    
                    <div className="border-t border-pink-100 dark:border-pink-800 my-6 pt-6">
                      <h3 className="font-medium text-lg text-pink-600 dark:text-pink-400 mb-4">Sitzplan</h3>
                      
                      <div className="mb-4">
                        <form onSubmit={searchSeating} className="flex gap-2">
                          <Input 
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Deinen Namen eingeben..."
                            className="flex-grow"
                          />
                          <Button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white">
                            Suchen
                          </Button>
                        </form>
                        
                        {foundTable && (
                          <div className="mt-2 p-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-md text-center">
                            Du sitzt an Tisch {foundTable}: {SEATING_PLAN.find(t => t.table === foundTable)?.name}
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <div className="flex flex-wrap justify-center gap-4 mb-4">
                          {SEATING_PLAN.map((table) => (
                            <div 
                              key={table.table}
                              className={`table-circle w-16 h-16 bg-white dark:bg-slate-800 border-2 border-pink-300 dark:border-pink-700 ${selectedTable === table.table ? 'selected' : ''}`}
                              onClick={() => setSelectedTable(table.table)}
                            >
                              <span className="font-semibold">{table.table}</span>
                            </div>
                          ))}
                        </div>
                        
                        {selectedTable && (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-pink-200 dark:border-pink-900">
                            <h4 className="font-medium text-lg text-pink-600 dark:text-pink-400 mb-2">
                              Tisch {selectedTable}: {SEATING_PLAN.find(t => t.table === selectedTable)?.name}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {SEATING_PLAN.find(t => t.table === selectedTable)?.seats.map((seat, i) => (
                                <span 
                                  key={i}
                                  className={`inline-block px-2 py-1 rounded-full text-sm 
                                    ${searchName && seat.toLowerCase().includes(searchName.toLowerCase()) 
                                      ? 'bg-pink-500 text-white' 
                                      : 'bg-pink-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}
                                >
                                  {seat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <footer className="text-center mt-16 md:mt-20 text-sm text-slate-500 dark:text-slate-400">
          <p>Mit Liebe erstellt für unseren besonderen Tag</p>
          <p className="mt-1 text-pink-400">❤️ Selinay & Atilla ❤️</p>
        </footer>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hochladen erfolgreich!</DialogTitle>
            <DialogDescription>
              Vielen Dank für das Teilen deiner Fotos. Sie wurden zu unserer Hochzeitsgalerie hinzugefügt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowSuccess(false)}
            >
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm !== null} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Foto löschen?</DialogTitle>
            <DialogDescription>
              Bist du sicher, dass du dieses Foto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(null)}
            >
              Abbrechen
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => showDeleteConfirm !== null && deletePhoto(showDeleteConfirm)}
            >
              Löschen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white dark:bg-slate-950">
          {selectedPhoto && (
            <>
              <div className="relative aspect-video w-full sm:aspect-auto sm:h-[40vh] md:h-[50vh]">
                {/* Using a div with background image for base64 instead of Next.js Image component */}
                <div 
                  className={`absolute inset-0 bg-contain bg-center bg-no-repeat ${selectedPhoto.filter === "hearts" ? "photo-frame-hearts" : ""} ${selectedPhoto.filter === "love" ? "vintage-border" : ""}`}
                  style={{ 
                    backgroundImage: `url(${selectedPhoto.url})`,
                    filter: getFilterStyle(selectedPhoto.filter) 
                  }}
                />
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => handleLike(selectedPhoto.id)}
                    className={`p-2 bg-black/40 rounded-full ${selectedPhoto.likes.includes(userName) ? "text-pink-400" : "text-white"} hover:bg-black/60`}
                    aria-label="Mag ich"
                  >
                    <Heart size={18} fill={selectedPhoto.likes.includes(userName) ? "#f472b6" : "none"} />
                  </button>
                  <button 
                    onClick={() => handleShare(selectedPhoto.url, selectedPhoto.title)}
                    className="p-2 bg-black/40 rounded-full text-white hover:bg-black/60"
                    aria-label="Teilen"
                  >
                    <Share2 size={18} />
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(selectedPhoto.id)}
                    className="p-2 bg-black/40 rounded-full text-white hover:bg-red-500"
                    aria-label="Löschen"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <DialogHeader className="p-4">
                <DialogTitle>{selectedPhoto.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex justify-between mt-1">
                    <span>Hochgeladen von {selectedPhoto.uploader}</span>
                    <span>{formatDate(selectedPhoto.dateUploaded)}</span>
                  </div>
                  {selectedPhoto.likes.length > 0 && (
                    <div className="mt-2 text-pink-500 flex items-center">
                      <Heart size={14} fill="#f472b6" className="mr-1" />
                      <span>{selectedPhoto.likes.length} {selectedPhoto.likes.length === 1 ? "Person gefällt" : "Personen gefällt"} dieses Foto</span>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

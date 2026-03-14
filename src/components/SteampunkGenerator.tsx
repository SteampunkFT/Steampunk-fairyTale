import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Upload, Sparkles, Loader2, Camera, Image as ImageIcon, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEAMPUNK_PROMPT = `Transform the couple in this image into a photorealistic steampunk fairytale couple. 
Maintain their facial features and likeness with extreme accuracy, as if it were a real photograph. 
Style: Photorealistic Steampunk Fairytale. 
Elements: Intricate brass and copper gears with realistic metallic textures, Victorian-era lace and velvet clothing with visible fabric details, leather goggles, clockwork accessories, glowing amber lights, and subtle magical fairytale sparkles. 
Color Palette: Deep teals, rich burgundies, warm creams, and polished metallic accents (gold, brass, copper). 
Atmosphere: Enchanting, mysterious, and highly detailed with cinematic lighting and realistic depth of field. 
The background should be a photorealistic whimsical clockwork forest or an ornate Victorian laboratory with floating gears. 
High-resolution, 8k, sharp focus, professional photography.`;

const Gear = ({ className, size = 24, duration = 10, reverse = false }: { className?: string, size?: number, duration?: number, reverse?: boolean }) => (
  <motion.div
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration, repeat: Infinity, ease: "linear" }}
    className={className}
  >
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </motion.div>
);

export default function SteampunkGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSteampunkImage = async () => {
    if (!image) return;

    setIsGenerating(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/png',
              },
            },
            {
              text: STEAMPUNK_PROMPT,
            },
          ],
        },
      });

      let foundImage = false;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          foundImage = true;
          break;
        }
      }

      if (!foundImage) {
        throw new Error("No image was generated. Please try again.");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err.message || "Failed to generate image. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      {/* Decorative Gears */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <Gear className="absolute -top-10 -left-10 text-amber-900" size={200} duration={40} />
        <Gear className="absolute top-1/4 -right-20 text-amber-800" size={150} duration={30} reverse />
        <Gear className="absolute -bottom-20 left-1/3 text-amber-700" size={250} duration={60} />
        <Gear className="absolute bottom-1/4 right-10 text-amber-900" size={80} duration={20} />
      </div>

      <header className="text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Gear className="text-amber-600" size={32} duration={5} />
            <h1 className="text-6xl md:text-7xl font-display font-black text-amber-950 tracking-tighter uppercase">
              Punkin Project
            </h1>
            <Gear className="text-amber-600" size={32} duration={5} reverse />
          </div>
          <p className="text-amber-800 font-serif italic text-xl md:text-2xl opacity-80">
            A Photorealistic Steampunk Fairytale Experience
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="h-[1px] w-12 bg-amber-900/20" />
            <Sparkles className="text-amber-600" size={20} />
            <div className="h-[1px] w-12 bg-amber-900/20" />
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Upload Section */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] border border-amber-200 shadow-2xl shadow-amber-900/5 relative overflow-hidden group"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Camera size={160} className="text-amber-900" />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-amber-950 flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Camera className="text-amber-700" size={24} />
              </div>
              Original Vision
            </h2>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-600/60 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
              Input Stage
            </span>
          </div>

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[4/5] rounded-3xl bg-stone-100 flex flex-col items-center justify-center cursor-pointer overflow-hidden border-2 border-dashed border-amber-200 hover:border-amber-500 transition-all group/upload shadow-inner"
          >
            {image ? (
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={image} 
                alt="Original" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <div className="text-center p-10 group-hover/upload:scale-110 transition-transform">
                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <ImageIcon size={40} className="text-amber-300" />
                </div>
                <p className="text-amber-900 font-serif text-xl mb-2">Upload your portrait</p>
                <p className="text-amber-600/60 text-sm italic">Capture the essence of the couple</p>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
            accept="image/*"
          />

          <button
            onClick={generateSteampunkImage}
            disabled={!image || isGenerating}
            className={`w-full mt-8 py-5 rounded-2xl font-display font-bold text-xl flex items-center justify-center gap-4 transition-all relative overflow-hidden group/btn ${
              !image || isGenerating 
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                : 'bg-amber-950 text-amber-50 hover:bg-black shadow-xl hover:shadow-amber-950/40'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" />
                <span>Forging the Fairytale...</span>
              </>
            ) : (
              <>
                <Wand2 className="group-hover/btn:rotate-12 transition-transform" />
                <span>Begin Transformation</span>
                <Sparkles size={18} className="absolute top-2 right-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </>
            )}
          </button>
        </motion.div>

        {/* Result Section */}
        <motion.div
          className="bg-amber-950 p-8 rounded-[2rem] border border-amber-800 shadow-2xl shadow-black relative overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Gear size={240} duration={50} />
          </div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-amber-50 flex items-center gap-3">
              <div className="p-2 bg-amber-900/50 rounded-lg border border-amber-800">
                <Sparkles className="text-amber-400" size={24} />
              </div>
              Steampunk Reality
            </h2>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400/60 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-800">
              Output Stage
            </span>
          </div>

          <div className="aspect-[4/5] rounded-3xl bg-black/40 flex flex-col items-center justify-center overflow-hidden border border-amber-900/50 shadow-2xl relative group/result">
            <AnimatePresence mode="wait">
              {generatedImage ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative"
                >
                  <img
                    src={generatedImage}
                    alt="Steampunk Result"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/result:opacity-100 transition-opacity flex items-end p-8">
                    <p className="text-amber-200 font-serif italic text-lg">A masterpiece of brass and magic</p>
                  </div>
                </motion.div>
              ) : isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-10"
                >
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    <Gear className="text-amber-600 absolute inset-0" size={128} duration={3} />
                    <Gear className="text-amber-400 absolute inset-4" size={96} duration={2} reverse />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="text-white animate-pulse" size={32} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-amber-100 mb-3">Weaving the Aether</h3>
                  <p className="text-amber-400/60 font-serif italic">Adding photorealistic textures, cinematic lighting, and Victorian elegance...</p>
                </motion.div>
              ) : (
                <div key="placeholder" className="text-center p-10">
                  <div className="w-24 h-24 mx-auto bg-amber-900/20 rounded-full flex items-center justify-center mb-6 border border-amber-800/30">
                    <Sparkles size={40} className="text-amber-900/40" />
                  </div>
                  <p className="text-amber-700 font-serif text-xl italic">The fairytale awaits your vision</p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 bg-red-950/40 border border-red-900/50 rounded-2xl text-red-200 text-sm flex items-start gap-3"
            >
              <div className="mt-1">⚠️</div>
              <p>{error}</p>
            </motion.div>
          )}

          {generatedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 grid grid-cols-2 gap-4"
            >
              <a
                href={generatedImage}
                download="steampunk-fairytale-couple.png"
                className="py-4 bg-amber-50 text-amber-950 rounded-2xl font-display font-bold text-center hover:bg-white transition-all shadow-lg"
              >
                Download Art
              </a>
              <button
                onClick={() => {
                  setGeneratedImage(null);
                  setImage(null);
                }}
                className="py-4 border border-amber-800 text-amber-400 rounded-2xl font-display font-bold hover:bg-amber-900/20 transition-all"
              >
                New Vision
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>

      <footer className="mt-24 text-center relative z-10">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-24 bg-amber-900/10" />
          <Gear className="text-amber-900/20" size={24} duration={15} />
          <div className="h-[1px] w-24 bg-amber-900/10" />
        </div>
        <p className="text-amber-950 font-display font-bold uppercase tracking-[0.3em] text-sm mb-2">
          Steampunk Fairytale
        </p>
        <p className="text-amber-800/60 font-serif italic text-sm">
          Where Victorian technology meets the magic of the Punkin Project
        </p>
        <p className="mt-8 text-amber-900/30 text-[10px] uppercase tracking-widest">
          © 2026 All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

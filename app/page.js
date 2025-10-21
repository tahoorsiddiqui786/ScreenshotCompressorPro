'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import AnimatedBackground from '@/components/AnimatedBackground';
import ActionCard from '@/components/ActionCard';
import UploadCard from '@/components/UploadCard';
import StatusBadge from '@/components/StatusBadge';
import ResultDisplay from '@/components/ResultDisplay';
import Footer from '@/components/Footer';
import { Camera } from 'lucide-react';

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [compressedImage, setCompressedImage] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState('');

  const TARGET_SIZE = 201 * 1024;

  const compressImage = async (canvas) => {
    setCompressionStatus('Compressing image...');
    
    let quality = 0.9;
    let compressed = null;
    let size = 0;
    let attempts = 0;
    const maxAttempts = 15;
    
    while (attempts < maxAttempts) {
      compressed = canvas.toDataURL('image/jpeg', quality);
      const base64Length = compressed.split(',')[1].length;
      size = (base64Length * 0.75);
      
      if (size <= TARGET_SIZE) break;
      
      quality -= 0.05;
      attempts++;
      
      if (quality < 0.1) {
        const scale = Math.sqrt(TARGET_SIZE / size);
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width * scale;
        newCanvas.height = canvas.height * scale;
        const ctx = newCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);
        canvas = newCanvas;
        quality = 0.8;
      }
    }
    
    setCompressedImage(compressed);
    setFileSize(Math.round(size / 1024));
    setCompressionStatus(size <= TARGET_SIZE ? 'Success! Image under 201KB' : 'Compressed to minimum size');
    setIsProcessing(false);
  };

  const captureScreen = async () => {
    try {
      setIsProcessing(true);
      setCompressionStatus('Capturing screenshot...');
      
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' }
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      stream.getTracks().forEach(track => track.stop());
      
      compressImage(canvas);
    } catch (err) {
      setCompressionStatus('Screenshot cancelled or failed');
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsProcessing(true);
    setCompressionStatus('Processing uploaded image...');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        compressImage(canvas);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const downloadImage = async () => {
    if (!compressedImage) return;
    
    // Generate filename with date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const filename = `screenshot_${year}-${month}-${day}_${hours}-${minutes}-${seconds}.jpg`;
    
    // Check if File System Access API is supported
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'JPEG Image',
            accept: { 'image/jpeg': ['.jpg', '.jpeg'] }
          }]
        });
        
        const writable = await handle.createWritable();
        const blob = await (await fetch(compressedImage)).blob();
        await writable.write(blob);
        await writable.close();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error saving file:', err);
        }
      }
    } else {
      // Fallback for browsers that don't support File System Access API
      const link = document.createElement('a');
      link.download = filename;
      link.href = compressedImage;
      link.click();
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col ${
      isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <AnimatedBackground isDark={isDark} />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <Header isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ActionCard
            icon={Camera}
            title="Capture Screen"
            description="Take a screenshot of any window or entire screen and compress it automatically"
            buttonText="Capture Screenshot"
            onClick={captureScreen}
            isProcessing={isProcessing}
            isDark={isDark}
            gradientColors={{
              iconDark: 'text-purple-400',
              iconLight: 'text-purple-600',
              button: isDark
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
            }}
          />

          <UploadCard
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
            isDark={isDark}
          />
        </div>

        <StatusBadge status={compressionStatus} fileSize={fileSize} isDark={isDark} />
        <ResultDisplay 
          compressedImage={compressedImage}
          fileSize={fileSize}
          onDownload={downloadImage}
          isDark={isDark}
        />
      </div>

      <Footer isDark={isDark} />
    </div>
  );
}

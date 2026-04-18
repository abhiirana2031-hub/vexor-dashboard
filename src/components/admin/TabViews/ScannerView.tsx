import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  ScanLine, 
  UserCircle, 
  Loader2, 
  Activity, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCcw,
  ShieldCheck,
  Shield
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { UserProfiles as UserType } from '@/entities';

export const ScannerView = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scannedUser, setScannedUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScannerInitialised, setIsScannerInitialised] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const SCANNER_ID = "neural-qr-reader";

  useEffect(() => {
    // Initialise scanner on mount if not already done
    if (!isScannerInitialised && !scanResult) {
       startScanner();
    }

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode(SCANNER_ID);
      scannerRef.current = html5QrCode;
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Quietly handle scan failures (usually means no QR found in frame)
        }
      );
      setIsScannerInitialised(true);
    } catch (err) {
      console.error("Scanner init failed", err);
      setError("Camera access denied or hardware failure.");
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScannerInitialised(false);
      } catch (err) {
        console.error("Scanner stop failed", err);
      }
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    try {
      const data = JSON.parse(decodedText);
      if (data.type === 'user_id' && data.id) {
        setScanResult(data.id);
        await stopScanner();
        fetchUserDetails(data.id);
      } else {
        // Not our format, ignore or show hint
      }
    } catch (e) {
      // Not JSON, ignore
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await BaseCrudService.getById<UserType>('userprofiles', userId);
      if (user) {
        setScannedUser(user);
      } else {
        setError("Neural Profile not found in central database.");
      }
    } catch (err) {
      setError("Connection synchronization failure.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setScannedUser(null);
    setError(null);
    startScanner();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h2 className="text-3xl font-black text-foreground tracking-tighter mb-2 uppercase italic">Neural_QR_Scanner</h2>
          <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.3em]">Identity Verification Module v4.0</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[500px] relative">
        <AnimatePresence mode="wait">
          {!scanResult && !error && (
            <motion.div 
              key="scanner-ui"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-sm aspect-square relative glass-card p-4 border-secondary/20 overflow-hidden"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary rounded-br-xl" />
              
              <div id={SCANNER_ID} className="w-full h-full rounded-lg overflow-hidden grayscale brightness-125 contrast-125" />
              
              {/* Scanning Ray Filter */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-secondary/5 to-transparent opacity-20" />
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-neon-cyan animate-scanner z-10" />
              
              <div className="absolute bottom-8 left-0 w-full text-center">
                 <p className="text-[9px] font-black uppercase tracking-[0.5em] text-secondary animate-pulse">Position_Code_in_Frame</p>
              </div>
            </motion.div>
          )}

          {isLoading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
            >
               <Loader2 className="w-12 h-12 text-secondary animate-spin" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">Synchronizing Identity Data...</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center space-y-6 border-destructive/20 max-w-md w-full"
            >
               <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-8 h-8 text-destructive" />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-foreground">Access_Denied</h3>
                  <p className="text-xs text-foreground/40 font-medium">{error}</p>
               </div>
               <button 
                 onClick={resetScanner}
                 className="futuristic-button group"
               >
                 <span className="relative z-10 flex items-center gap-2">
                   <RefreshCcw className="w-4 h-4" />
                   Retry Verification
                 </span>
                 <div className="btn-glow" />
               </button>
            </motion.div>
          )}

          {scannedUser && !isLoading && !error && (
            <motion.div 
              key="identity-card"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              className="w-full max-w-md perspective-1000"
            >
               <div className="glass-card p-0 overflow-hidden border-secondary/30 relative">
                  {/* Neural Grid Overlay */}
                  <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                  
                  {/* Decorative Header */}
                  <div className="bg-secondary/10 border-b border-white/5 p-4 flex justify-between items-center">
                     <span className="text-[8px] font-black uppercase tracking-[0.3em] text-secondary">Neural_Verification_Success</span>
                     <ShieldCheck className="w-4 h-4 text-secondary" />
                  </div>

                  <div className="p-10 space-y-8">
                     <div className="flex gap-8 items-center">
                        <div className="w-32 h-32 rounded-2xl bg-white/[0.03] border border-secondary/40 p-1 relative group">
                           {scannedUser.profilePhoto ? (
                             <img 
                               src={scannedUser.profilePhoto} 
                               alt="profile" 
                               className="w-full h-full object-cover rounded-xl"
                             />
                           ) : (
                             <UserCircle className="w-full h-full text-foreground/10" />
                           )}
                           <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shadow-neon-cyan z-10">
                              <Shield className="w-4 h-4 text-black" />
                           </div>
                        </div>

                        <div className="space-y-3 flex-1">
                           <div>
                              <label className="text-[8px] font-black uppercase tracking-widest text-foreground/20">Name_Entity</label>
                              <h3 className="text-2xl font-black tracking-tighter uppercase text-foreground truncate">{scannedUser.fullName}</h3>
                           </div>
                           <div>
                              <label className="text-[8px] font-black uppercase tracking-widest text-foreground/20">Operational_Role</label>
                              <p className="text-xs font-black uppercase tracking-widest text-secondary truncate">{scannedUser.jobTitle || 'Standard Operative'}</p>
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                        <div className="space-y-1">
                           <label className="text-[7px] font-black uppercase tracking-widest text-foreground/20">Access_ID</label>
                           <p className="font-mono text-[10px] text-foreground/60 truncate uppercase">{scannedUser._id}</p>
                        </div>
                        <div className="space-y-1 text-right">
                           <label className="text-[7px] font-black uppercase tracking-widest text-foreground/20">Communication_Protocol</label>
                           <p className="text-[10px] text-foreground/60 truncate">{scannedUser.email}</p>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[7px] font-black uppercase tracking-widest text-foreground/20">Trust_Level</label>
                           <div className="flex items-center gap-1.5 pt-1">
                              <div className="flex gap-0.5">
                                 {[1,2,3,4,5].map(i => (
                                    <div key={i} className={`w-1.5 h-3 rounded-sm ${i <= (scannedUser.isVerified ? 5 : 2) ? 'bg-secondary' : 'bg-white/5'}`} />
                                 ))}
                              </div>
                              <span className="text-[8px] font-black text-secondary/60 ml-2 uppercase tracking-tighter">{scannedUser.isVerified ? 'VERIFIED' : 'RESTRICTED'}</span>
                           </div>
                        </div>
                        <div className="space-y-1 text-right">
                           <label className="text-[7px] font-black uppercase tracking-widest text-foreground/20">Network_Sync</label>
                           <p className="text-[10px] text-neon-green flex items-center justify-end gap-1 font-black">
                              <Activity className="w-3 h-3 animate-pulse" />
                              ACTIVE
                           </p>
                        </div>
                     </div>

                     <button 
                       onClick={resetScanner}
                       className="w-full py-4 rounded-xl bg-white/[0.03] border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-foreground/40 hover:text-secondary hover:bg-secondary/5 hover:border-secondary/40 transition-all group"
                     >
                       <span className="group-hover:tracking-[0.6em] transition-all">Clear Identity & Scan Again</span>
                     </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

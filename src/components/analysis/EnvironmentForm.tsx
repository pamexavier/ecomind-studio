import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Home, Dumbbell, Briefcase, Construction, 
  RefreshCw, MapPin, Maximize, ArrowRight, Upload, FileText, 
  Sun, Ruler, Waves, Sparkles, Leaf
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnvironmentFormData, RoomType, InterventionType } from '@/types/analysis';

declare global {
  interface Window {
    google: any;
  }
}

interface EnvironmentFormProps {
  onSubmit: (data: EnvironmentFormData, images: File[], planta?: File) => void;
  isLoading?: boolean;
}

export default function EnvironmentForm({ onSubmit, isLoading }: EnvironmentFormProps) {
  const [formData, setFormData] = useState<EnvironmentFormData>({
    roomType: 'residencia',
    interventionType: 'construcao',
    location: '',
    description: '',
    area: '',
    height: '',
    ceilingType: 'Laje de concreto',
    sunPosition: 'Tarde (Oeste - Mais quente)',
    objectives: []
  });

  const [ambienteFiles, setAmbienteFiles] = useState<File[]>([]);
  const [plantaFile, setPlantaFile] = useState<File | null>(null);
  const autocompleteRef = useRef<any>(null);

  // Restauração do Autocomplete (Caminho Reverso)
  useEffect(() => {
    const initAutocomplete = () => {
      const inputElement = document.getElementById('location-input') as HTMLInputElement;
      
      if (window.google && window.google.maps && window.google.maps.places && inputElement) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputElement, {
          types: ['(cities)'],
          componentRestrictions: { country: 'br' },
          fields: ['formatted_address', 'geometry']
        });

        autocompleteRef.current.addListener('place_changed', () => {
          const place = autocompleteRef.current.getPlace();
          if (place && place.formatted_address) {
            setFormData(prev => ({ ...prev, location: place.formatted_address }));
          }
        });

        // Evita submissão acidental ao selecionar com Enter
        inputElement.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') e.preventDefault();
        });
      }
    };

    if (window.google?.maps?.places) {
      initAutocomplete();
    } else {
      // Caso o script ainda esteja carregando
      const timer = setInterval(() => {
        if (window.google?.maps?.places) {
          initAutocomplete();
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, ambienteFiles, plantaFile || undefined);
  };

  const toggleObjective = (obj: string) => {
    const current = formData.objectives;
    setFormData({
      ...formData,
      objectives: current.includes(obj) 
        ? current.filter(i => i !== obj) 
        : [...current, obj]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* 1. FINALIDADE E TIPO (Botões Modernos) */}
      <section className="space-y-6">
        <div className="space-y-4">
          <Label className="text-lg font-black uppercase tracking-tight text-slate-500 flex items-center gap-2">
            <Home className="w-5 h-5 text-primary" /> Finalidade do Ambiente
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'residencia', label: 'Residencial', icon: Home },
              { id: 'academia', label: 'Academia', icon: Dumbbell },
              { id: 'comercio', label: 'Comercial', icon: Building2 },
              { id: 'escritorio', label: 'Escritório', icon: Briefcase },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setFormData({ ...formData, roomType: type.id as RoomType })}
                className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                  formData.roomType === type.id 
                  ? 'border-primary bg-primary/5 text-primary ring-4 ring-primary/5' 
                  : 'border-slate-100 bg-white text-slate-400 hover:border-primary/40'
                }`}
              >
                <type.icon className="w-7 h-7 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { id: 'construcao', label: 'Obra Nova', icon: Construction, desc: 'Planejamento do zero' },
            { id: 'retrofit', label: 'Retrofit', icon: RefreshCw, desc: 'Reforma e melhoria técnica' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({ ...formData, interventionType: type.id as InterventionType })}
              className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                formData.interventionType === type.id 
                ? 'border-primary bg-primary/5 ring-4 ring-primary/5' 
                : 'border-slate-100 bg-white hover:border-primary/40'
              }`}
            >
              <div className={`p-3 rounded-xl ${formData.interventionType === type.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                <type.icon className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-black uppercase tracking-tight ${formData.interventionType === type.id ? 'text-primary' : 'text-slate-600'}`}>{type.label}</p>
                <p className="text-[10px] font-medium text-slate-400">{type.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 2. DADOS TÉCNICOS (Estilo Clean) */}
      <Card className="overflow-hidden border-none shadow-2xl shadow-slate-200/50 bg-slate-50/50">
        <CardContent className="p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <MapPin className="w-3 h-3" /> Localização (Cidade/UF)
              </Label>
              <Input 
                id="location-input"
                placeholder="Busque sua cidade..." 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
                autoComplete="off"
                className="bg-white border-none h-12 text-base shadow-sm focus-visible:ring-primary font-medium text-slate-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Maximize className="w-3 h-3" /> Área (m²)
                </Label>
                <Input 
                  type="number" 
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  required
                  className="bg-white border-none h-12 font-medium text-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Ruler className="w-3 h-3" /> Pé-direito (m)
                </Label>
                <Input 
                  type="number" 
                  step="0.1" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  required
                  className="bg-white border-none h-12 font-medium text-slate-700"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Incidência Solar Crítica</Label>
              <Select onValueChange={(v) => setFormData({...formData, sunPosition: v})} defaultValue={formData.sunPosition}>
                <SelectTrigger className="bg-white border-none h-12 font-medium text-slate-700 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manhã (Leste)">Manhã (Leste)</SelectItem>
                  <SelectItem value="Tarde (Oeste - Mais quente)">Tarde (Oeste - Mais quente)</SelectItem>
                  <SelectItem value="Norte (Sol o dia todo)">Norte (Sol o dia todo)</SelectItem>
                  <SelectItem value="Sul (Pouca incidência)">Sul (Pouca incidência)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tipo de Cobertura</Label>
              <Select onValueChange={(v) => setFormData({...formData, ceilingType: v})} defaultValue={formData.ceilingType}>
                <SelectTrigger className="bg-white border-none h-12 font-medium text-slate-700 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laje de Concreto">Laje de Concreto</SelectItem>
                  <SelectItem value="Telha Cerâmica">Telha Cerâmica</SelectItem>
                  <SelectItem value="Telha Metálica/Sanduíche">Telha Metálica/Sanduíche</SelectItem>
                  <SelectItem value="Vidro / Policarbonato">Vidro / Policarbonato</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. UPLOADS (Design de Prancheta) */}
      <section className="space-y-4">
        <Label className="text-lg font-black uppercase tracking-tight text-slate-500 flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" /> Documentação do Local
        </Label>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative group">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setPlantaFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${plantaFile ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white group-hover:border-primary/40'}`}>
              <FileText className={`w-8 h-8 mx-auto mb-3 ${plantaFile ? 'text-primary' : 'text-slate-300'}`} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">{plantaFile ? plantaFile.name : 'Subir Planta Baixa'}</p>
            </div>
          </div>

          <div className="relative group">
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={(e) => setAmbienteFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${ambienteFiles.length > 0 ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white group-hover:border-primary/40'}`}>
              <Upload className={`w-8 h-8 mx-auto mb-3 ${ambienteFiles.length > 0 ? 'text-primary' : 'text-slate-300'}`} />
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">
                {ambienteFiles.length > 0 ? `${ambienteFiles.length} fotos selecionadas` : 'Fotos do Ambiente'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESCRIÇÃO E OBJETIVOS */}
      <section className="space-y-6">
        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Prioridades do Projeto</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'luz', label: 'Luz natural', icon: Sun },
              { id: 'frio', label: 'Conforto térmico', icon: Waves },
              { id: 'sustentavel', label: 'Eficiência energética', icon: Leaf },
            ].map((obj) => (
              <button
                key={obj.id}
                type="button"
                onClick={() => toggleObjective(obj.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                  formData.objectives.includes(obj.label)
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  : 'bg-white text-slate-400 border-slate-200 hover:border-primary/40'
                }`}
              >
                <obj.icon className="w-3 h-3" />
                {obj.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Análise do Entorno (Vizinhança, Árvores, Ruído)</Label>
          <Textarea 
            placeholder="Ex: Área com vegetação densa, vizinhos colados, alta incidência de vento sul..." 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="min-h-[120px] bg-white border-slate-100 rounded-2xl p-4 shadow-sm text-slate-600 focus-visible:ring-primary"
          />
        </div>
      </section>

      <Button 
        type="submit" 
        className="w-full h-16 text-sm font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] bg-primary hover:bg-primary/90"
        disabled={isLoading}
      >
        {isLoading ? 'Auditando Estruturas...' : 'Gerar Diagnóstico Ambiental'}
      </Button>
    </form>
  );
}
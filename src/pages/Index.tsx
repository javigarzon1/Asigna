import { useState, useEffect } from "react";
import { FileUpload } from "@/components/FileUpload";
import { QueryCard } from "@/components/QueryCard";
import { LawyerManagement } from "@/components/LawyerManagement";
import { Dashboard } from "@/components/Dashboard";
import { Query, QueryStatus } from "@/types/query";
import { Lawyer, lawyers as initialLawyers } from "@/types/lawyer";
import { assignQueries } from "@/lib/assignmentLogic";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Search, Filter, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [lawyers, setLawyers] = useState<Lawyer[]>(initialLawyers);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<QueryStatus | "all">("all");
  const [urgentFilter, setUrgentFilter] = useState<"all" | "urgent" | "normal">("all");

  useEffect(() => {
    let filtered = queries;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.ritm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.typology.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.assignedLawyer?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(q => q.status === statusFilter);
    }

    if (urgentFilter === "urgent") {
      filtered = filtered.filter(q => q.isUrgent);
    } else if (urgentFilter === "normal") {
      filtered = filtered.filter(q => !q.isUrgent);
    }

    setFilteredQueries(filtered);
  }, [queries, searchTerm, statusFilter, urgentFilter]);

  const handleFileLoaded = (loadedQueries: Query[]) => {
    const assigned = assignQueries(loadedQueries, lawyers);
    setQueries(assigned);
    
    // Update lawyer assignment counts
    const counts = new Map<string, number>();
    assigned.forEach(query => {
      if (query.assignedLawyerEmail) {
        const lawyer = lawyers.find(l => l.email === query.assignedLawyerEmail);
        if (lawyer) {
          counts.set(lawyer.id, (counts.get(lawyer.id) || 0) + 1);
        }
      }
    });

    setLawyers(prev => prev.map(lawyer => ({
      ...lawyer,
      currentAssignments: counts.get(lawyer.id) || 0
    })));

    // Show assignment summary with custom component
    const assignedQueries = assigned.filter(q => q.assignedLawyer);
    const unassigned = assigned.filter(q => !q.assignedLawyer).length;

    toast.success(`Se han cargado ${assigned.length} consultas`, {
      description: (
        <div className="space-y-3 mt-2">
          <div className="font-semibold text-base">Resumen de Asignaciones:</div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {assignedQueries.map((q, index) => (
              <div key={index} className="flex items-start gap-2 text-base">
                <span className="font-medium text-primary min-w-[120px]">{q.ritm}</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-medium">{q.assignedLawyer}</span>
              </div>
            ))}
          </div>
          {unassigned > 0 && (
            <div className="pt-2 border-t border-border">
              <span className="text-warning font-semibold text-base">
                ⚠️ {unassigned} consultas sin asignar
              </span>
            </div>
          )}
        </div>
      ),
      duration: 15000,
    });
  };

  const handleUpdateLawyer = (lawyerId: string, updates: Partial<Lawyer>) => {
    setLawyers(prev => 
      prev.map(lawyer => 
        lawyer.id === lawyerId ? { ...lawyer, ...updates } : lawyer
      )
    );
    toast.success("Configuración de letrado actualizada");
  };

  const handleStatusChange = (queryId: string, status: QueryStatus) => {
    setQueries(prev =>
      prev.map(query =>
        query.id === queryId ? { ...query, status } : query
      )
    );
    toast.success("Estado de consulta actualizado");
  };

  const handleReassign = () => {
    const reassigned = assignQueries(queries, lawyers);
    setQueries(reassigned);
    
    const counts = new Map<string, number>();
    reassigned.forEach(query => {
      if (query.assignedLawyerEmail) {
        const lawyer = lawyers.find(l => l.email === query.assignedLawyerEmail);
        if (lawyer) {
          counts.set(lawyer.id, (counts.get(lawyer.id) || 0) + 1);
        }
      }
    });

    setLawyers(prev => prev.map(lawyer => ({
      ...lawyer,
      currentAssignments: counts.get(lawyer.id) || 0
    })));

    toast.success("Consultas reasignadas correctamente");
  };

  const pendingQueries = filteredQueries.filter(q => q.status === "pending" || q.status === "in_process");
  const completedQueries = filteredQueries.filter(q => q.status !== "pending" && q.status !== "in_process");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-primary p-2">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Sistema de Asignación de Consultas
              </h1>
              <p className="text-sm text-muted-foreground">Ramón y Cajal Abogados - CaixaBank</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="upload">Cargar Consultas</TabsTrigger>
            <TabsTrigger value="queries">Gestión de Consultas</TabsTrigger>
            <TabsTrigger value="lawyers">Gestión de Letrados</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            {queries.length === 0 ? (
              <FileUpload onFileLoaded={handleFileLoaded} />
            ) : (
              <div className="space-y-6">
                <Dashboard queries={queries} lawyers={lawyers} />
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Archivo cargado correctamente
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleReassign}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Reasignar consultas
                    </Button>
                    <FileUpload onFileLoaded={handleFileLoaded} />
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            {queries.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay consultas cargadas. Por favor, carga un archivo Excel desde la pestaña "Cargar Consultas".
                </p>
              </div>
            ) : (
              <>
                <Dashboard queries={queries} lawyers={lawyers} />
                
                <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-lg border border-border shadow-soft">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por RITM, tipología o letrado..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as QueryStatus | "all")}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="in_process">En Proceso</SelectItem>
                      <SelectItem value="completed">Finalizada</SelectItem>
                      <SelectItem value="reclassified">Reclasificada</SelectItem>
                      <SelectItem value="elevated">Elevada COpS</SelectItem>
                      <SelectItem value="info_requested">Info. Solicitada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={urgentFilter} onValueChange={(value) => setUrgentFilter(value as "all" | "urgent" | "normal")}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Urgencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="urgent">Solo urgentes</SelectItem>
                      <SelectItem value="normal">Solo normales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Consultas Pendientes ({pendingQueries.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {pendingQueries.map(query => (
                        <QueryCard
                          key={query.id}
                          query={query}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  </div>

                  {completedQueries.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Consultas Completadas/Archivadas ({completedQueries.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {completedQueries.map(query => (
                          <QueryCard
                            key={query.id}
                            query={query}
                            onStatusChange={handleStatusChange}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="lawyers">
            <LawyerManagement
              lawyers={lawyers}
              queries={queries}
              onUpdateLawyer={handleUpdateLawyer}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;

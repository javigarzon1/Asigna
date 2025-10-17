import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Lawyer } from "@/types/lawyer";
import { Users } from "lucide-react";

interface LawyerManagementProps {
  lawyers: Lawyer[];
  onUpdateLawyer: (lawyerId: string, updates: Partial<Lawyer>) => void;
}

export function LawyerManagement({ lawyers, onUpdateLawyer }: LawyerManagementProps) {
  return (
    <Card className="p-6 bg-card border-border shadow-medium">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Gestión de Letrados</h2>
        </div>

        <div className="space-y-4">
          {lawyers.map((lawyer) => (
            <Card key={lawyer.id} className="p-4 bg-muted/30 border-border">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{lawyer.name}</h3>
                    <p className="text-sm text-muted-foreground">{lawyer.email}</p>
                  </div>
                  <Badge variant={lawyer.canHandleUrgent ? "default" : "secondary"}>
                    {lawyer.canHandleUrgent ? "Urgentes: Sí" : "Urgentes: No"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`percentage-${lawyer.id}`} className="text-sm font-medium">
                      Porcentaje de asignación: {lawyer.workPercentage}%
                    </Label>
                  </div>
                  <Slider
                    id={`percentage-${lawyer.id}`}
                    value={[lawyer.workPercentage]}
                    onValueChange={(value) => 
                      onUpdateLawyer(lawyer.id, { workPercentage: value[0] })
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor={`urgent-${lawyer.id}`} className="text-sm">
                    Puede asumir consultas urgentes
                  </Label>
                  <Switch
                    id={`urgent-${lawyer.id}`}
                    checked={lawyer.canHandleUrgent}
                    onCheckedChange={(checked) =>
                      onUpdateLawyer(lawyer.id, { canHandleUrgent: checked })
                    }
                  />
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Tipologías:</p>
                  <div className="flex flex-wrap gap-2">
                    {lawyer.typologies.map((typology, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {typology}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-md p-2">
                  <p className="text-sm font-medium text-foreground">
                    Consultas asignadas: <span className="text-primary">{lawyer.currentAssignments || 0}</span>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}

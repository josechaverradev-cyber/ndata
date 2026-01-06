import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { PatientLayout } from "@/layouts/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Paperclip, Image, Smile, Check, CheckCheck } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "doctor",
    name: "Dra. María García",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    message: "¡Hola Carlos! ¿Cómo te has sentido con el nuevo plan nutricional?",
    time: "10:30 AM",
    date: "Hoy",
    read: true,
  },
  {
    id: 2,
    sender: "patient",
    name: "Carlos Méndez",
    message: "¡Hola Dra.! Me he sentido muy bien, con más energía durante el día.",
    time: "10:45 AM",
    date: "Hoy",
    read: true,
  },
  {
    id: 3,
    sender: "doctor",
    name: "Dra. María García",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    message: "¡Excelente! Eso es una muy buena señal. ¿Has podido seguir el horario de comidas que acordamos?",
    time: "10:48 AM",
    date: "Hoy",
    read: true,
  },
  {
    id: 4,
    sender: "patient",
    name: "Carlos Méndez",
    message: "Sí, aunque a veces se me complica el snack de la tarde por el trabajo. ¿Puedo sustituirlo por algo más rápido?",
    time: "11:00 AM",
    date: "Hoy",
    read: true,
  },
  {
    id: 5,
    sender: "doctor",
    name: "Dra. María García",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
    message: "Claro que sí. Te recomiendo tener a mano frutos secos (un puñado de 30g) o una barrita de proteínas. Son opciones rápidas y nutritivas que no requieren preparación.",
    time: "11:15 AM",
    date: "Hoy",
    read: true,
  },
  {
    id: 6,
    sender: "patient",
    name: "Carlos Méndez",
    message: "Perfecto, muchas gracias. Lo implementaré esta semana.",
    time: "11:20 AM",
    date: "Hoy",
    read: false,
  },
];

export default function PatientMessages() {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to an API
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <PatientLayout>
      <div className="animate-fade-in h-[calc(100vh-10rem)] lg:h-[calc(100vh-8rem)]">
        <Card className="border-border shadow-card h-full flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-border py-3 lg:py-4 px-3 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 lg:gap-3">
                <Avatar className="h-8 w-8 lg:h-10 lg:w-10 border-2 border-primary/20">
                  <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs lg:text-sm">MG</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm lg:text-base">Dra. María García</CardTitle>
                  <div className="flex items-center gap-1 lg:gap-2">
                    <span className="h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full bg-success"></span>
                    <span className="text-[10px] lg:text-xs text-muted-foreground">En línea</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="text-[10px] lg:text-xs hidden sm:flex">Tu Nutricionista</Badge>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 lg:space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div className={`flex items-end gap-1.5 lg:gap-2 max-w-[85%] lg:max-w-[70%] ${msg.sender === "patient" ? "flex-row-reverse" : ""}`}>
                  {msg.sender === "doctor" && (
                    <Avatar className="h-6 w-6 lg:h-8 lg:w-8 shrink-0">
                      <AvatarImage src={msg.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px] lg:text-xs">MG</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-3 py-2 lg:px-4 lg:py-2.5 ${msg.sender === "patient"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                      }`}
                  >
                    <p className="text-xs lg:text-sm">{msg.message}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${msg.sender === "patient" ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}>
                      <span className="text-[10px] lg:text-xs">{msg.time}</span>
                      {msg.sender === "patient" && (
                        msg.read ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Message Input */}
          <div className="border-t border-border p-2 lg:p-4">
            <div className="flex items-center gap-1 lg:gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 lg:h-10 lg:w-10">
                <Paperclip className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 lg:h-10 lg:w-10 hidden sm:flex">
                <Image className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <Input
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-muted/50 border-0 text-sm h-9 lg:h-10"
              />
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8 lg:h-10 lg:w-10 hidden sm:flex">
                <Smile className="h-4 w-4 lg:h-5 lg:w-5" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="icon"
                className="gradient-primary shadow-glow h-8 w-8 lg:h-10 lg:w-10"
              >
                <Send className="h-3 w-3 lg:h-4 lg:w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PatientLayout>
  );
}

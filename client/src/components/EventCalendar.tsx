import { useState } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay,
  addDays
} from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Star, Sprout } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
  type?: "user" | "festival" | "crop";
}

// Agriculture and festival data
const agricultureData = [
  {
    month: "January",
    festivals: "Pongal, Thai Pongal, Mattu Pongal, Thiruvalluvar Day",
    cropRecommendations: "Samba harvest, groundnut sowing, sunflower planting, rice nursery preparation"
  },
  {
    month: "February",
    festivals: "Maha Shivaratri",
    cropRecommendations: "Sesame sowing, millet sowing, sugarcane irrigation, land prep for Kuruvai"
  },
  {
    month: "March",
    festivals: "Panguni Uthiram",
    cropRecommendations: "Summer vegetable sowing, lady's finger, brinjal, tomato, rice nursery (early kuruvai)"
  },
  {
    month: "April",
    festivals: "Tamil New Year, Chitra Pournami",
    cropRecommendations: "Short-term vegetable sowing, green gram, black gram, land preparation for Kuruvai paddy"
  },
  {
    month: "May",
    festivals: "Vaikasi Visakam",
    cropRecommendations: "Cotton sowing, maize cultivation, Kuruvai preparation, drip irrigation crops"
  },
  {
    month: "June",
    festivals: "—",
    cropRecommendations: "Kuruvai planting, turmeric, banana, sugarcane, rainwater harvesting work"
  },
  {
    month: "July",
    festivals: "Aadi Amavasai, Aadi Perukku",
    cropRecommendations: "Kuruvai crop management, sorghum, pearl millet, fertilizer for banana"
  },
  {
    month: "August",
    festivals: "Krishna Jayanthi, Avani Avittam, Vinayagar Chaturthi",
    cropRecommendations: "Samba nursery, fodder crops, maize fertilizer application"
  },
  {
    month: "September",
    festivals: "Navratri beginning",
    cropRecommendations: "Samba paddy planting, mustard, sesame sowing, rice pest control"
  },
  {
    month: "October",
    festivals: "Ayudha Pooja, Vijayadashami",
    cropRecommendations: "Samba irrigation, Rabi season preparation, planting chillies, onion, carrot"
  },
  {
    month: "November",
    festivals: "Deepavali, Karthigai Deepam",
    cropRecommendations: "Groundnut sowing, green gram, Kuruvai harvest, winter vegetable planting"
  },
  {
    month: "December",
    festivals: "Margazhi festivals, Vaikunta Ekadashi",
    cropRecommendations: "Rabi crops like wheat, maize, chickpea; frost/pest control"
  }
];

interface EventCalendarProps {
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
}

export function EventCalendar({ onPrevMonth, onNextMonth, currentDate: externalCurrentDate, onDateChange }: EventCalendarProps) {
  const [internalCurrentDate, setInternalCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: ""
  });

  const currentDate = externalCurrentDate || internalCurrentDate;

  const nextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    if (onDateChange) {
      onDateChange(newDate);
    } else {
      setInternalCurrentDate(newDate);
    }
    if (onNextMonth) onNextMonth();
  };

  const prevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    if (onDateChange) {
      onDateChange(newDate);
    } else {
      setInternalCurrentDate(newDate);
    }
    if (onPrevMonth) onPrevMonth();
  };

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setIsDialogOpen(true);
  };

  const handleCreateEvent = () => {
    if (selectedDate && newEvent.title) {
      const event: CalendarEvent = {
        id: Math.random().toString(36).substr(2, 9),
        title: newEvent.title,
        date: selectedDate,
        description: newEvent.description,
        type: "user"
      };
      setEvents([...events, event]);
      setNewEvent({ title: "", description: "" });
      setIsDialogOpen(false);
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "EEE";
    const startDate = startOfWeek(startOfMonth(currentDate));

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-sm py-2">
          {format(addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-2">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    // Get today's date for comparison
    const today = new Date();

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const dayEvents = events.filter(event => isSameDay(event.date, cloneDay));
        
        // Check if this day is today
        const isToday = isSameDay(day, today);
        
        // Check for festivals and crop recommendations
        const monthName = format(day, "MMMM");
        const monthData = agricultureData.find(data => data.month === monthName);
        const hasFestival = monthData && monthData.festivals && monthData.festivals !== "—";
        const hasCropRecommendation = monthData && monthData.cropRecommendations;

        days.push(
          <div
            className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-colors relative ${
              !isSameMonth(day, monthStart)
                ? "bg-muted/50 text-muted-foreground"
                : "bg-background hover:bg-accent"
            } ${
              isToday ? "border-2 border-primary" : ""
            }`}
            key={day.toString()}
            onClick={() => handleDateClick(cloneDay)}
          >
            {/* Today indicator */}
            {isToday && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></div>
            )}
            
            {/* Festival indicator */}
            {hasFestival && (
              <div className="absolute top-1 left-1">
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              </div>
            )}
            
            {/* Crop recommendation indicator */}
            {hasCropRecommendation && (
              <div className="absolute bottom-1 left-1">
                <Sprout className="h-3 w-3 text-green-500" />
              </div>
            )}
            
            <span className={`text-sm font-medium ${isToday ? "text-primary font-bold" : ""}`}>
              {formattedDate}
            </span>
            <div className="mt-1 space-y-1">
              {dayEvents.map(event => (
                <div 
                  key={event.id} 
                  className={`text-xs p-1 rounded truncate ${
                    event.type === "festival" 
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-200" 
                      : event.type === "crop" 
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-primary text-primary-foreground"
                  }`}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Event Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderHeader()}
          <div className="calendar">
            {renderDays()}
            {renderCells()}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm">Festivals</span>
            </div>
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-green-500" />
              <span className="text-sm">Crop Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-sm">User Events</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? `Create Event for ${format(selectedDate, "PPP")}` : "Create Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Enter event title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                placeholder="Enter event description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent} disabled={!newEvent.title}>
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
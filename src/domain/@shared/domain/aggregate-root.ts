import EventInterface from "../event/event.interface";


export abstract class AgreggateRoot{
    _events: Set<EventInterface> = new Set();

    addEvent(event: EventInterface){
        this._events.add(event);
    }   

    clearEvents(){
        this._events.clear();
    }
}
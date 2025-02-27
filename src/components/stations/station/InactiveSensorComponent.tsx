"use client";
    import {
        DndContext,
        closestCenter,
        useSensors,
        useSensor,
        MouseSensor,
        TouchSensor,
        DragStartEvent,
        DragEndEvent,
    } from "@dnd-kit/core";
    import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
    import SortableSensorItem, { Sensor } from "./SortableSensorItem";
    import { useCallback } from "react";

    interface InactiveSensorsListProps {
        sensors: Sensor[];
        draggingSensorId: number | null;
        onDragStartAction: (id: string) => void;
        onDragEndAction: (activeId: string, overId: string) => void;
    }

    export default function InactiveSensorsList({
        sensors,
        draggingSensorId,
        onDragStartAction,
        onDragEndAction,
    }: InactiveSensorsListProps) {
        const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 5 } });
        const touchSensor = useSensor(TouchSensor);
        const sensorsDnD = useSensors(mouseSensor, touchSensor);

        const handleDragStart = useCallback((event: DragStartEvent) => {
            onDragStartAction(event.active.id.toString());
        }, [onDragStartAction]);

        const handleDragEnd = useCallback((event: DragEndEvent) => {
            if (event.over) {
                onDragEndAction(
                    event.active.id.toString(),
                    event.over.id.toString()
                );
            }
        }, [onDragEndAction]);

        return (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-bordeaux mb-4">Capteurs inactifs</h2>
                <DndContext
                    sensors={sensorsDnD}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={sensors.map((sensor) => sensor.sensor_id.toString())}
                        strategy={verticalListSortingStrategy}
                    >
                        {sensors.map((sensor) => (
                            <SortableSensorItem
                                key={sensor.sensor_id}
                                sensor={sensor}
                                isDragging={draggingSensorId === sensor.sensor_id}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        );
    }
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

interface ActiveSensorsListProps {
  sensors: Sensor[];
  draggingSensorId: number | null;
  onDragStartAction: (id: string) => void;
  onDragEndAction: (activeId: string, overId: string) => void;
  onConfirmAction: () => void;
  onRollbackAction: () => void;
  isModified: boolean;
}

export default function ActiveSensorsList({
  sensors,
  draggingSensorId,
  onDragStartAction,
  onDragEndAction,
  onConfirmAction,
  onRollbackAction,
  isModified,
}: Readonly<ActiveSensorsListProps>) {
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
          <h2 className="text-2xl font-semibold text-bordeaux mb-4">Capteurs actifs</h2>
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
          <div className="flex justify-end space-x-4 mt-4">
              <button
                  onClick={onRollbackAction}
                  disabled={!isModified}
                  className="px-4 py-2 bg-gray-300 text-bordeaux rounded hover:bg-gray-400"
              >
                  Annuler
              </button>
              <button
                  onClick={onConfirmAction}
                  disabled={!isModified}
                  className="px-4 py-2 bg-bordeaux text-white rounded hover:bg-bordeaux-dark"
              >
                  Confirmer
              </button>
          </div>
      </div>
  );
}
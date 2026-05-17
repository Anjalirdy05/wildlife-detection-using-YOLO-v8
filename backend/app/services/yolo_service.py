"""
WildEye YOLO Detection Service
Uses YOLOv8 for real-time wildlife detection
"""
import cv2
import numpy as np
from datetime import datetime
from typing import List, Optional
import uuid
import logging

logger = logging.getLogger("wildeye.yolo")

# Animal class mapping (COCO + custom wildlife classes)
WILDLIFE_CLASSES = {
    "tiger": {"danger": True, "coco_id": None},
    "elephant": {"danger": False, "coco_id": 61},
    "leopard": {"danger": True, "coco_id": None},
    "lion": {"danger": True, "coco_id": None},
    "deer": {"danger": False, "coco_id": None},
    "zebra": {"danger": False, "coco_id": 22},
    "giraffe": {"danger": False, "coco_id": 23},
    "wolf": {"danger": True, "coco_id": None},
    "bear": {"danger": True, "coco_id": 21},
    "rhinoceros": {"danger": False, "coco_id": None},
    "horse": {"danger": False, "coco_id": 17},
    "cow": {"danger": False, "coco_id": 19},
    "sheep": {"danger": False, "coco_id": 18},
    "dog": {"danger": False, "coco_id": 16},
    "cat": {"danger": False, "coco_id": 15},
    "bird": {"danger": False, "coco_id": 14},
}

class WildlifeDetector:
    def __init__(self, model_path: str = "yolov8n.pt", confidence_threshold: float = 0.5):
        self.model = None
        self.model_path = model_path
        self.confidence_threshold = confidence_threshold
        self.initialized = False
        self._load_model()

    def _load_model(self):
        try:
            from ultralytics import YOLO
            self.model = YOLO(self.model_path)
            self.initialized = True
            logger.info(f"YOLOv8 model loaded: {self.model_path}")
        except Exception as e:
            logger.warning(f"Could not load YOLO model: {e}. Running in simulation mode.")
            self.initialized = False

    def detect(self, frame: np.ndarray, camera_id: str) -> List[dict]:
        if not self.initialized:
            return self._simulate_detection(camera_id)

        results = self.model(frame, conf=self.confidence_threshold, verbose=False)
        detections = []

        for result in results:
            for box in result.boxes:
                class_id = int(box.cls[0])
                class_name = result.names[class_id].lower()
                confidence = float(box.conf[0])

                # Check if it's a wildlife class
                animal_name = self._map_to_wildlife(class_name)
                if not animal_name:
                    continue

                x1, y1, x2, y2 = box.xyxy[0].tolist()
                info = WILDLIFE_CLASSES.get(animal_name, {})

                detections.append({
                    "id": f"DET-{uuid.uuid4().hex[:8].upper()}",
                    "animal": animal_name.title(),
                    "confidence": round(confidence * 100),
                    "camera_id": camera_id,
                    "is_danger": info.get("danger", False),
                    "bbox": {"x": x1, "y": y1, "width": x2 - x1, "height": y2 - y1},
                    "timestamp": datetime.now().isoformat(),
                    "track_id": f"TRK-{uuid.uuid4().hex[:4].upper()}",
                })

        return detections

    def _map_to_wildlife(self, class_name: str) -> Optional[str]:
        """Map YOLO class name to wildlife species."""
        mapping = {
            "elephant": "elephant",
            "zebra": "zebra",
            "giraffe": "giraffe",
            "bear": "bear",
            "horse": "horse",
            "cow": "cow",
            "sheep": "sheep",
            "dog": "wolf",  # Map dogs to wolf in wildlife context
            "cat": "leopard",  # Proxy mapping
            "bird": "bird",
        }
        return mapping.get(class_name)

    def _simulate_detection(self, camera_id: str) -> List[dict]:
        """Simulation mode when YOLO model is not available."""
        import random
        animals = list(WILDLIFE_CLASSES.keys())
        if random.random() < 0.3:  # 30% chance of detection
            animal = random.choice(animals)
            info = WILDLIFE_CLASSES[animal]
            return [{
                "id": f"DET-{uuid.uuid4().hex[:8].upper()}",
                "animal": animal.title(),
                "confidence": random.randint(72, 99),
                "camera_id": camera_id,
                "is_danger": info["danger"],
                "bbox": {
                    "x": random.randint(50, 400),
                    "y": random.randint(50, 200),
                    "width": random.randint(80, 200),
                    "height": random.randint(80, 200),
                },
                "timestamp": datetime.now().isoformat(),
                "track_id": f"TRK-{uuid.uuid4().hex[:4].upper()}",
            }]
        return []

    def draw_detections(self, frame: np.ndarray, detections: List[dict]) -> np.ndarray:
        """Draw YOLO bounding boxes on frame."""
        frame = frame.copy()
        for det in detections:
            bbox = det["bbox"]
            x, y, w, h = int(bbox["x"]), int(bbox["y"]), int(bbox["width"]), int(bbox["height"])
            color = (51, 51, 255) if det["is_danger"] else (0, 255, 136)  # BGR

            # Main bounding box
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)

            # Corner accents
            corner = 15
            thickness = 3
            for cx, cy, dx, dy in [(x, y, 1, 1), (x+w, y, -1, 1), (x, y+h, 1, -1), (x+w, y+h, -1, -1)]:
                cv2.line(frame, (cx, cy), (cx + dx*corner, cy), color, thickness)
                cv2.line(frame, (cx, cy), (cx, cy + dy*corner), color, thickness)

            # Label background
            label = f"{det['animal']} {det['confidence']}% | {det['track_id']}"
            (lw, lh), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.4, 1)
            cv2.rectangle(frame, (x, y - lh - 8), (x + lw + 4, y), color, -1)
            cv2.putText(frame, label, (x + 2, y - 4),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.4, (0, 0, 0), 1)

        return frame


# Singleton detector instance
_detector: Optional[WildlifeDetector] = None

def get_detector() -> WildlifeDetector:
    global _detector
    if _detector is None:
        _detector = WildlifeDetector()
    return _detector

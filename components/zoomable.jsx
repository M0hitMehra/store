import React, { useEffect, useRef, useState } from "react";

const Zoomable = ({ children, initialZoom = 2, minZoom = 1.25, maxZoom = 4, zoomSpeed = 0.01 }) => {
  const [zoomed, setZoomed] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const handleMouseover = () => setZoomed(true);
    const handleMousemove = (evt) => {
      if (!zoomed) return;

      const elPos = container.getBoundingClientRect();
      const percentageX = `${((evt.clientX - elPos.left) * 100) / elPos.width}%`;
      const percentageY = `${((evt.clientY - elPos.top) * 100) / elPos.height}%`;

      container.style.setProperty("--zoom-pos-x", percentageX);
      container.style.setProperty("--zoom-pos-y", percentageY);
    };
    const handleMouseout = () => {
      setZoom(initialZoom);
      setZoomed(false);
    };
    const handleWheel = (evt) => {
      if (!zoomed) return;

      evt.preventDefault();
      const newZoom = zoom + evt.deltaY * (zoomSpeed * -1);
      setZoom(Math.max(Math.min(newZoom, maxZoom), minZoom));
    };

    container.addEventListener("mouseover", handleMouseover);
    container.addEventListener("mousemove", handleMousemove);
    container.addEventListener("mouseout", handleMouseout);
    container.addEventListener("wheel", handleWheel);

    return () => {
      container.removeEventListener("mouseover", handleMouseover);
      container.removeEventListener("mousemove", handleMousemove);
      container.removeEventListener("mouseout", handleMouseout);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [zoomed, zoom, initialZoom, minZoom, maxZoom, zoomSpeed]);

  useEffect(() => {
    const container = containerRef.current;
    container.style.setProperty("--zoom", zoom);
  }, [zoom]);

  return (
    <div
      ref={containerRef}
      className={`imageContainer ${zoomed ? "imageContainer--zoomed" : ""}`}
    >
      {children}
    </div>
  );
};

export default Zoomable;

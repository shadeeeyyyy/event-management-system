// src/components/EventCarousel.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import CarouselEventCard from './CarouselEventCard';
import './EventCarousel.css';

// Constants for carousel behavior
const CARD_WIDTH = 250; // Base width of a CarouselEventCard
const CARD_MARGIN = 15; // Horizontal margin on one side of a CarouselEventCard (total 30px between cards)
const NUM_DUPLICATES = 3; // Number of cards to duplicate at each end for seamless looping

const EventCarousel = ({ onSelectEvent, searchTerm }) => {
  const [events, setEvents] = useState([]);
  const [currentLogicalSlide, setCurrentLogicalSlide] = useState(0);
  const [currentVisualSlide, setCurrentVisualSlide] = useState(NUM_DUPLICATES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const carouselTrackRef = useRef(null);
  const slideIntervalRef = useRef(null);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events for carousel:', err);
        setError('Failed to load events for carousel. Please try again later.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = useMemo(() => 
    events.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
  ), [events, searchTerm]);

  // Create an extended array for infinite looping
  const extendedEvents = useMemo(() => {
    if (filteredEvents.length === 0) return [];
    if (filteredEvents.length <= NUM_DUPLICATES) {
      const repeated = [];
      for (let i = 0; i < NUM_DUPLICATES * 2 + filteredEvents.length; i++) {
        repeated.push(filteredEvents[i % filteredEvents.length]);
      }
      return repeated;
    }
    const startDuplicates = filteredEvents.slice(-NUM_DUPLICATES);
    const endDuplicates = filteredEvents.slice(0, NUM_DUPLICATES);
    return [...startDuplicates, ...filteredEvents, ...endDuplicates];
  }, [filteredEvents]);

  // Reset slide indices if filteredEvents change
  useEffect(() => {
    if (filteredEvents.length > 0) {
      setCurrentLogicalSlide(0);
      setCurrentVisualSlide(NUM_DUPLICATES);
      setIsTransitioning(true);
    } else {
      setCurrentLogicalSlide(0);
      setCurrentVisualSlide(0);
      setIsTransitioning(false);
    }
  }, [filteredEvents]);

  // Auto-slide functionality
  useEffect(() => {
    if (slideIntervalRef.current) {
      clearInterval(slideIntervalRef.current);
    }

    if (filteredEvents.length > 1) {
      slideIntervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setCurrentVisualSlide(prev => {
          const newVisual = prev + 1;
          // Update logical slide immediately for the details section
          setCurrentLogicalSlide((newVisual - NUM_DUPLICATES + filteredEvents.length) % filteredEvents.length);
          return newVisual;
        });
      }, 4000);
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [filteredEvents]);

  // Calculate the transform value to center the current visual slide
  const getTransformValue = useCallback(() => {
    if (!carouselTrackRef.current || extendedEvents.length === 0) return '0px';
    const wrapperWidth = carouselTrackRef.current.parentElement.offsetWidth;
    const cardFullWidth = CARD_WIDTH + (2 * CARD_MARGIN);
    const targetCardLeft = currentVisualSlide * cardFullWidth;
    const translateX = (wrapperWidth / 2) - (targetCardLeft + (CARD_WIDTH / 2) + CARD_MARGIN);
    return `${translateX}px`;
  }, [currentVisualSlide, extendedEvents]);

  // Handle seamless looping after CSS transition ends
  const handleTransitionEnd = useCallback(() => {
    const isAtEndDuplicate = currentVisualSlide >= extendedEvents.length - NUM_DUPLICATES;
    const isAtStartDuplicate = currentVisualSlide < NUM_DUPLICATES;

    if (isAtEndDuplicate || isAtStartDuplicate) {
      setIsTransitioning(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          let newVisualSlideIndex;
          if (isAtEndDuplicate) {
            newVisualSlideIndex = NUM_DUPLICATES + (currentVisualSlide - (extendedEvents.length - NUM_DUPLICATES));
          } else {
            newVisualSlideIndex = extendedEvents.length - (2 * NUM_DUPLICATES) + currentVisualSlide;
          }
          setCurrentVisualSlide(newVisualSlideIndex);
        });
      });
    }
  }, [currentVisualSlide, extendedEvents.length]);

  // Manual navigation functions
  const nextSlide = () => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    setIsTransitioning(true);
    setCurrentVisualSlide(prev => {
      const newVisual = prev + 1;
      setCurrentLogicalSlide((newVisual - NUM_DUPLICATES + filteredEvents.length) % filteredEvents.length);
      return newVisual;
    });
  };

  const prevSlide = () => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    setIsTransitioning(true);
    setCurrentVisualSlide(prev => {
      const newVisual = prev - 1;
      setCurrentLogicalSlide((newVisual - NUM_DUPLICATES + filteredEvents.length) % filteredEvents.length);
      return newVisual;
    });
  };

  const goToLogicalSlide = (logicalIndex) => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    setIsTransitioning(true);
    setCurrentVisualSlide(NUM_DUPLICATES + logicalIndex);
    setCurrentLogicalSlide(logicalIndex);
  };

  if (loading) {
    return <div className="carousel-message">Loading events...</div>;
  }

  if (error) {
    return <div className="carousel-message carousel-error">{error}</div>;
  }

  if (filteredEvents.length === 0) {
    return <div className="carousel-message">No events available or matching your search.</div>;
  }

  const activeEvent = filteredEvents[currentLogicalSlide];

  return (
    <div className="event-carousel-section">
      <div className="carousel-container">
        <button className="carousel-arrow left-arrow" onClick={prevSlide}>
          &lt;
        </button>
        <div className="carousel-track-wrapper">
          <div
            ref={carouselTrackRef}
            className="carousel-track"
            style={{
              transform: `translateX(${getTransformValue()})`,
              transition: isTransitioning ? `transform 0.6s ease-in-out` : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedEvents.map((event, index) => (
              <CarouselEventCard
                key={`${event._id}-${index}`}
                event={event}
                isActive={index === currentVisualSlide}
                onClick={onSelectEvent}
              />
            ))}
          </div>
        </div>
        <button className="carousel-arrow right-arrow" onClick={nextSlide}>
          &gt;
        </button>
      </div>

      <div className="carousel-dots">
        {filteredEvents.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentLogicalSlide ? 'active' : ''}`}
            onClick={() => goToLogicalSlide(index)}
          ></span>
        ))}
      </div>

      {activeEvent && (
        <div className="active-event-details">
          <div>
          <span className="details-date">
            {new Date(activeEvent.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          <span>, </span>
          <span className="details-location">{activeEvent.location}</span>
          </div>
          <h3 className="details-title">{activeEvent.title}</h3>
          <p className="details-price">
            {activeEvent.price > 0 ? `₹${activeEvent.price.toFixed(2)} onwards` : 'Free'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EventCarousel;
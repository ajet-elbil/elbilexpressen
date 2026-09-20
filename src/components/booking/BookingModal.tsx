// Three-step booking wizard (service selection, date/time, contact form) that emails via EmailJS.

import { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../../emailjs.config';
import { meta, TIME_SLOTS } from '../../data/content';
import { BUSINESS, MAILTO_HREF, TEL_HREF } from '../../seo.config';
import { SERVICES } from '../../data/serviceIcons';
import { CheckIcon, CloseIcon } from '../ui/Icons';
import type { BookingFormData, CalendarDay } from '../../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dates are handled as local calendar days throughout. `toISOString()` and
// `new Date('YYYY-MM-DD')` both work in UTC, which for anyone east of Greenwich
// (all of Norway) shifts a local-midnight date back one day: the calendar then
// disabled Mondays, allowed Saturdays and emailed the workshop the day before
// the one the customer clicked.

/** 'YYYY-MM-DD' for the given date in the visitor's own timezone. */
const toDateString = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** Inverse of `toDateString`: local midnight of that day. */
const parseDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const formatLongDate = (dateStr: string): string =>
  parseDateString(dateStr).toLocaleDateString('no-NO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    regNumber: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // The button that triggers a send is pinned to the top of the modal on mobile,
  // so the customer may have scrolled the error message out of sight.
  useEffect(() => {
    if (submitError) errorRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [submitError]);


  // Check if selected date is at least 3 days away
  const isDateTooSoon = (dateStr: string) => {
    if (!dateStr) return false;
    const selectedDate = parseDateString(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = selectedDate.getTime() - today.getTime();
    // round, not ceil: across a DST change two local midnights are 23 or 25 hours apart
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 3;
  };

  // Check if selected date is a weekend
  const isWeekend = (dateStr: string) => {
    const day = parseDateString(dateStr).getDay();
    return day === 0 || day === 6;
  };

  // Check if a date is selectable (not weekend, not too soon)
  const isDateSelectable = (date: Date): boolean => {
    const dateStr = toDateString(date);
    return !isDateTooSoon(dateStr) && !isWeekend(dateStr);
  };

  // Get all days in the current month view
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Adjust for Monday as first day (0 = Sunday, so we shift)
    const adjustedStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: CalendarDay[] = [];

    // Add days from previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = adjustedStart - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date, isCurrentMonth: false, isSelectable: false });
    }

    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true, isSelectable: isDateSelectable(date) });
    }

    // Add days from next month to fill the last week (to make 6 weeks total)
    const remainingDays = 42 - days.length; // 6 weeks * 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false, isSelectable: false });
    }

    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isDateSelectable(date)) {
      setSelectedDate(toDateString(date));
    }
  };

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Format registration number
  const handleRegNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 7) value = value.slice(0, 7);
    // Format as XX XXXXX or XXX XXXX
    if (value.length > 2) {
      value = value.slice(0, 2) + ' ' + value.slice(2);
    }
    setFormData(prev => ({ ...prev, regNumber: value }));
  };

  // Check if can proceed to next step
  const canProceed = () => {
    if (step === 1) return selectedServices.length > 0;
    if (step === 2) {
      return selectedDate &&
        selectedTime &&
        !isWeekend(selectedDate) &&
        !isDateTooSoon(selectedDate);
    }
    if (step === 3) {
      return formData.firstName && formData.lastName && formData.email && formData.phone && formData.regNumber;
    }
    return false;
  };

  // Handle submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      // Validate EmailJS configuration
      const missingConfig = [];
      if (!EMAILJS_CONFIG.SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID.trim() === '') {
        missingConfig.push('VITE_EMAILJS_SERVICE_ID');
      }
      if (!EMAILJS_CONFIG.TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID.trim() === '') {
        missingConfig.push('VITE_EMAILJS_TEMPLATE_ID');
      }
      if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY.trim() === '') {
        missingConfig.push('VITE_EMAILJS_PUBLIC_KEY');
      }

      if (missingConfig.length > 0) {
        // `npm run build` refuses to build without these (scripts/check-env.mjs),
        // so this only happens in `npm run dev`. Customers never see developer
        // instructions; they get the same call-or-email fallback as any failed send.
        console.error('EmailJS configuration missing:', missingConfig.join(', '));
        console.error('Please set these environment variables in your .env file.');
        setSubmitError(true);
        setIsSubmitting(false);
        return;
      }
      // Format selected services
      const servicesList = selectedServices
        .map(id => SERVICES.find(s => s.id === id)?.label)
        .filter(Boolean)
        .join(', ');

      // Format date in Norwegian format
      const formattedDate = selectedDate ? formatLongDate(selectedDate) : '';

      // Prepare email template parameters
      const templateParams = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        car_registration: formData.regNumber,
        services: servicesList,
        appointment_date: formattedDate,
        appointment_time: selectedTime,
        message: formData.message || 'Ingen melding',
        // Full details for email body
        full_details: `
Ny bestilling fra ${meta.brand}

KUNDEINFORMASJON:
Navn: ${formData.firstName} ${formData.lastName}
E-post: ${formData.email}
Telefon: ${formData.phone}
Bilregistreringsnummer: ${formData.regNumber}

VALGTE TJENESTER:
${servicesList}

TIMEBESTILLING:
Dato: ${formattedDate}
Tid: ${selectedTime}

${formData.message ? `MELDING:\n${formData.message}` : ''}
        `.trim()
      };

      // Send email with public key as 4th parameter
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      // Do NOT show the success panel here: the workshop got nothing, so telling
      // the customer "we have received your request" would lose the booking
      // without either side knowing. Keep the form filled in so they can retry.
      console.error('EmailJS Error:', error);
      setSubmitError(true);
      setIsSubmitting(false);
    }
  };

  // Reset modal
  const resetModal = () => {
    setStep(1);
    setSelectedServices([]);
    setSelectedDate('');
    setSelectedTime('');
    setCurrentMonth(new Date());
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      regNumber: '',
      message: '',
    });
    setIsSubmitted(false);
    setSubmitError(false);
  };

  // Handle close
  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const progressPercent = Math.round((step / 3) * 100);

  return (
    <div className="booking-modal-overlay" onClick={handleClose}>
      <div
        className="booking-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {/* Header */}
        <div className="booking-modal-header">
          <button className="booking-close-btn" onClick={handleClose} aria-label="Lukk">
            <CloseIcon />
          </button>
          <h2 id="booking-modal-title">Ønsker du å bestille time?</h2>
          <p>Fyll ut skjemaet under, eller <a href={`mailto:${meta.email}`}>kontakt oss</a>.</p>
        </div>

        {/* Progress Bar */}
        {!isSubmitted && (
          <div className="booking-progress">
            <span className="booking-progress-text">Steg {step} av 3 -</span>
            <div className="booking-progress-bar">
              <div
                className="booking-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              <span className="booking-progress-percent">{progressPercent}%</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="booking-modal-content">
          {isSubmitted ? (
            /* Success State */
            <div className="booking-success">
              <div className="booking-success-icon">
                <CheckIcon />
              </div>
              <h3>Takk for din bestilling!</h3>
              <p>Vi har mottatt din forespørsel og vil kontakte deg snart for å bekrefte timen.</p>
              <div className="booking-success-summary">
                <h4>Oppsummering:</h4>
                <p><strong>Tjenester:</strong> {selectedServices.map(id => SERVICES.find(s => s.id === id)?.label).join(', ')}</p>
                <p><strong>Dato:</strong> {formatLongDate(selectedDate)}</p>
                <p><strong>Tid:</strong> {selectedTime}</p>
                <p><strong>Registreringsnummer:</strong> {formData.regNumber}</p>
              </div>
              <button className="btn btn-primary" onClick={handleClose}>Lukk</button>
            </div>
          ) : (
            <>
              {/* Navigation Buttons - Moved to top for better mobile UX */}
              <div className="booking-navigation booking-navigation-top">
                {step > 1 && (
                  <button
                    type="button"
                    className="btn btn-secondary booking-btn-back"
                    onClick={() => setStep(step - 1)}
                  >
                    Forrige
                  </button>
                )}
                <div className="booking-nav-spacer" />
                {step < 3 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed()}
                  >
                    Neste
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary booking-btn-submit"
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                  >
                    {isSubmitting ? 'Sender...' : 'SEND INN'}
                  </button>
                )}
              </div>

              {submitError && step === 3 && (
                <p className="booking-error" role="alert" ref={errorRef}>
                  Beklager, vi klarte ikke å sende bestillingen din. Prøv igjen om litt, eller ring{' '}
                  <a href={TEL_HREF}>{BUSINESS.phone}</a> eller send e-post til{' '}
                  <a href={MAILTO_HREF}>{BUSINESS.email}</a>.
                </p>
              )}

              {/* Step 1: Service Selection */}
              {step === 1 && (
                <div className="booking-step">
                  <h3>Velg tjenester</h3>
                  <div className="booking-services-grid">
                    {SERVICES.map(service => (
                      <label
                        key={service.id}
                        className={`booking-service-item ${selectedServices.includes(service.id) ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.id)}
                          onChange={() => toggleService(service.id)}
                        />
                        <div className="booking-service-icon">
                          <service.icon />
                        </div>
                        <span className="booking-service-label">{service.label}</span>
                        {service.price && (
                          <span className="booking-service-price">{service.price}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time Selection */}
              {step === 2 && (
                <div className="booking-step">
                  <h3>Velg dato og tid</h3>
                  <div className="booking-datetime">
                    <div className="booking-date-section">
                      <label>Velg dato</label>
                      <p className="booking-date-hint">Minimum 3 dager i forveien (ikke helger)</p>

                      {/* Calendar Navigation */}
                      <div className="booking-calendar-nav">
                        <button
                          type="button"
                          className="booking-calendar-nav-btn"
                          onClick={goToPreviousMonth}
                          aria-label="Forrige måned"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                          </svg>
                        </button>
                        <h4 className="booking-calendar-month">
                          {currentMonth.toLocaleDateString('no-NO', { month: 'long', year: 'numeric' })}
                        </h4>
                        <button
                          type="button"
                          className="booking-calendar-nav-btn"
                          onClick={goToNextMonth}
                          aria-label="Neste måned"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="booking-calendar">
                        {/* Weekday headers */}
                        <div className="booking-calendar-weekdays">
                          <div className="booking-calendar-weekday">Man</div>
                          <div className="booking-calendar-weekday">Tir</div>
                          <div className="booking-calendar-weekday">Ons</div>
                          <div className="booking-calendar-weekday">Tor</div>
                          <div className="booking-calendar-weekday">Fre</div>
                          <div className="booking-calendar-weekday booking-calendar-weekend">Lør</div>
                          <div className="booking-calendar-weekday booking-calendar-weekend">Søn</div>
                        </div>

                        {/* Calendar days */}
                        <div className="booking-calendar-days">
                          {getCalendarDays().map((day, index) => {
                            const dateStr = toDateString(day.date);
                            const isSelected = selectedDate === dateStr;
                            const isToday = toDateString(new Date()) === dateStr;

                            return (
                              <button
                                key={index}
                                type="button"
                                className={`booking-calendar-day ${!day.isCurrentMonth ? 'booking-calendar-day-other' : ''
                                  } ${!day.isSelectable ? 'booking-calendar-day-disabled' : ''
                                  } ${isSelected ? 'booking-calendar-day-selected' : ''
                                  } ${isToday ? 'booking-calendar-day-today' : ''
                                  }`}
                                onClick={() => handleDateSelect(day.date)}
                                disabled={!day.isSelectable}
                                aria-label={day.date.toLocaleDateString('no-NO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              >
                                {day.date.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="booking-time-section">
                      <label>Velg tid</label>
                      <div className="booking-time-grid">
                        {TIME_SLOTS.map(time => (
                          <button
                            key={time}
                            type="button"
                            className={`booking-time-slot ${selectedTime === time ? 'selected' : ''}`}
                            onClick={() => setSelectedTime(time)}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Form */}
              {step === 3 && (
                <div className="booking-step">
                  <h3>Dine opplysninger</h3>
                  <form className="booking-form" onSubmit={e => e.preventDefault()}>
                    <div className="booking-form-row">
                      <div className="booking-form-group">
                        <label htmlFor="firstName">Fornavn <span className="required">*</span></label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Skriv inn fornavn"
                          required
                        />
                      </div>
                      <div className="booking-form-group">
                        <label htmlFor="lastName">Etternavn <span className="required">*</span></label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Skriv inn etternavn"
                          required
                        />
                      </div>
                    </div>

                    <div className="booking-form-group">
                      <label htmlFor="email">E-post <span className="required">*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="E-post"
                        required
                      />
                    </div>

                    <div className="booking-form-group">
                      <label htmlFor="phone">Telefonnummer <span className="required">*</span></label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Skriv inn telefonnummer"
                        required
                      />
                    </div>

                    <div className="booking-form-group">
                      <label htmlFor="regNumber">Bilregistreringsnummer <span className="required">*</span></label>
                      <input
                        type="text"
                        id="regNumber"
                        name="regNumber"
                        value={formData.regNumber}
                        onChange={handleRegNumberChange}
                        placeholder="AB 12345"
                        required
                      />
                    </div>

                    <div className="booking-form-group">
                      <label htmlFor="message">Hva gjelder det?</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Skriv inn hva det gjelder"
                        rows={4}
                      />
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * CareSphere Intelligent, Dynamic & Animated 3D User Guide Engine
 * Context-aware, role-adaptive, multilingual healthcare assistance system.
 */
(function(window) {
  'use strict';

  const CareSphereGuide = {
    state: {
      currentPage: 'home',
      currentRole: 'patient',
      language: 'en',
      drawerOpen: false,
      tourActive: false,
      tourStepIndex: 0,
      currentTourSteps: [],
      progress: {
        completed: []
      }
    },

    // 1. Contextual Guide Registry for all pages and roles
    registry: {
      home_patient: {
        id: 'home_patient',
        category: 'Getting Started',
        icon: 'network',
        title: {
          en: 'Your Health Dashboard',
          kn: 'ನಿಮ್ಮ ಆರೋಗ್ಯ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
          hi: 'आपका स्वास्थ्य डैशबोर्ड'
        },
        desc: {
          en: 'Central hub to monitor nearby hospital beds, find medicines, check blood stock, and access emergency services.',
          kn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಹಾಸಿಗೆಗಳು, ಔಷಧಿಗಳು, ರಕ್ತ ಸಂಗ್ರಹ ಮತ್ತು ತುರ್ತು ಸೇವೆಗಳನ್ನು ಪರಿಶೀಲಿಸುವ ಮುಖ್ಯ ಕೇಂದ್ರ.',
          hi: 'निकटतम अस्पताल बेड, दवाइयां, ब्लड बैंक और आपातकालीन सेवाओं की निगरानी का मुख्य केंद्र।'
        },
        steps: [
          {
            selector: '#searchInput',
            title: { en: 'Global Healthcare Search', kn: 'ಜಾಗತಿಕ ಹುಡುಕಾಟ', hi: 'वैश्विक खोज' },
            desc: {
              en: 'Press "/" or tap here to search any hospital, doctor, medicine, or blood group across Karnataka.',
              kn: 'ಆಸ್ಪತ್ರೆ, ವೈದ್ಯರು, ಔಷಧಿ ಅಥವಾ ರಕ್ತದ ಗುಂಪನ್ನು ಹುಡುಕಲು "/" ಒತ್ತಿರಿ ಅಥವಾ ಇಲ್ಲಿ ಟ್ಯಾಪ್ ಮಾಡಿ.',
              hi: 'किसी भी अस्पताल, डॉक्टर, दवा या रक्त समूह को खोजने के लिए "/" दबाएं या यहां टैप करें।'
            }
          },
          {
            selector: '.topbar-emergency-btn',
            title: { en: 'Emergency SOS Hotline', kn: 'ತುರ್ತು SOS ಹಾಟ್‌ಲೈನ್', hi: 'आपातकालीन SOS' },
            desc: {
              en: 'Instant 1-tap access to 108 Emergency Ambulance, 112 Unified Police/Medical, and triage guidance.',
              kn: '108 ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು 112 ಸಹಾಯವಾಣಿಗೆ ತಕ್ಷಣದ 1-ಟ್ಯಾಪ್ ಸಂಪರ್ಕ.',
              hi: '108 एम्बुलेंस और 112 आपातकालीन हेल्पलाइन से तुरंत 1-टैप में संपर्क करें।'
            }
          },
          {
            selector: '.cs-overview-grid',
            title: { en: 'Live Healthcare Overview', kn: 'ಲೈವ್ ಆರೋಗ್ಯ ಸ್ಥಿತಿ', hi: 'लाइव स्वास्थ्य अवलोकन' },
            desc: {
              en: 'Live count of available General & ICU beds, doctors on duty, blood units, and essential medicines.',
              kn: 'ಲಭ್ಯವಿರುವ ಜನರಲ್ & ICU ಹಾಸಿಗೆಗಳು, ವೈದ್ಯರು, ರಕ್ತದ ಯೂನಿಟ್‌ಗಳು ಮತ್ತು ಔಷಧಿಗಳ ನೇರ ಮಾಹಿತಿ.',
              hi: 'उपलब्ध जनरल और आईसीयू बेड, ड्यूटी पर डॉक्टर, ब्लड यूनिट और आवश्यक दवाओं की लाइव स्थिति।'
            }
          },
          {
            selector: '.patient-services',
            title: { en: 'Quick Care Services', kn: 'ತ್ವರಿತ ಆರೋಗ್ಯ ಸೇವೆಗಳು', hi: 'त्वरित स्वास्थ्य सेवाएं' },
            desc: {
              en: 'Direct portals to find hospital beds, consult doctors, check medicines, book appointments, and explore government schemes.',
              kn: 'ಹಾಸಿಗೆಗಳು, ರಕ್ತ, ವೈದ್ಯರು, ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಮತ್ತು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಿಗೆ ನೇರ ಲಿಂಕ್‌ಗಳು.',
              hi: 'अस्पताल बेड, डॉक्टर, दवा, अपॉइंटमेंट और सरकारी योजनाओं के लिए सीधे पोर्टल।'
            }
          },
          {
            selector: '.nearby-hospitals-section',
            title: { en: 'Nearby Hospitals & Live Bed Occupancy', kn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗಳು & ಹಾಸಿಗೆ ಲಭ್ಯತೆ', hi: 'निकटतम अस्पताल और बेड उपलब्धता' },
            desc: {
              en: 'Inspect verified live bed meters (General, ICU, Oxygen) and estimated OPD wait times before traveling.',
              kn: 'ಪ್ರಯಾಣಿಸುವ ಮೊದಲು ಜನರಲ್, ಐಸಿಯು ಹಾಸಿಗೆ ಲಭ್ಯತೆ ಮತ್ತು ಒಪಿಡಿ ಕಾಯುವ ಸಮಯವನ್ನು ಪರಿಶೀಲಿಸಿ.',
              hi: 'जाने से पहले लाइव बेड मीटर (जनरल, आईसीयू) और ओपीडी प्रतीक्षा समय की जांच करें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'How do I know if bed availability is verified?', kn: 'ಹಾಸಿಗೆ ಲಭ್ಯತೆ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿದೆಯೇ ಎಂದು ತಿಳಿಯುವುದು ಹೇಗೆ?', hi: 'बेड उपलब्धता सत्यापित है या नहीं, यह कैसे जानें?' },
            a: {
              en: 'CareSphere syncs live telemetry every 5 minutes from authorized hospital management systems, marked with a pulsing green indicator.',
              kn: 'ಕೇರ್‌ಸ್ಪಿಯರ್ ಪ್ರತಿ 5 ನಿಮಿಷಕ್ಕೆ ಅಧಿಕೃತ ಆಸ್ಪತ್ರೆ ವ್ಯವಸ್ಥೆಯಿಂದ ಲೈವ್ ಮಾಹಿತಿಯನ್ನು ನವೀಕರಿಸುತ್ತದೆ.',
              hi: 'केयरस्फीयर हर 5 मिनट में अधिकृत अस्पताल प्रणालियों से लाइव डेटा सिंक करता है।'
            }
          },
          {
            q: { en: 'How do I change my location or district?', kn: 'ನನ್ನ ಸ್ಥಳ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಬದಲಾಯಿಸುವುದು ಹೇಗೆ?', hi: 'अपना स्थान या ज़िला कैसे बदलें?' },
            a: {
              en: 'Tap the location node pill in the top header (e.g., 📍 Bengaluru Urban) or use the search bar with your PIN code.',
              kn: 'ಮೇಲಿನ ಹೆಡರ್‌ನಲ್ಲಿರುವ ಸ್ಥಳ ಬ್ಯಾಡ್ಜ್ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ ಅಥವಾ ನಿಮ್ಮ ಪಿನ್ ಕೋಡ್ ನಮೂದಿಸಿ.',
              hi: 'शीर्ष हेडर में स्थान बैज पर टैप करें या अपना पिन कोड दर्ज करें।'
            }
          }
        ],
        tips: {
          en: 'Tip: Press "/" on your keyboard anywhere in CareSphere to jump directly to global search.',
          kn: 'ಸಲಹೆ: ಗ್ಲೋಬಲ್ ಸರ್ಚ್‌ಗೆ ಹೋಗಲು ನಿಮ್ಮ ಕೀಬೋರ್ಡ್‌ನಲ್ಲಿ "/" ಒತ್ತಿರಿ.',
          hi: 'सुझाव: वैश्विक खोज पर तुरंत जाने के लिए अपने कीबोर्ड पर "/" दबाएं।'
        },
        related: ['beds', 'medicines', 'blood', 'appointments']
      },

      beds: {
        id: 'beds',
        category: 'Hospitals & Beds',
        icon: 'hospital',
        title: {
          en: 'Find Hospitals & Check Beds',
          kn: 'ಆಸ್ಪತ್ರೆಗಳು & ಹಾಸಿಗೆ ಲಭ್ಯತೆ',
          hi: 'अस्पताल खोजें और बेड जांचें'
        },
        desc: {
          en: 'Real-time bed availability search across government, autonomous, and private empanelled hospitals.',
          kn: 'ಸರ್ಕಾರಿ ಮತ್ತು ಖಾಸಗಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ರಿಯಲ್-ಟೈಮ್ ಹಾಸಿಗೆ ಲಭ್ಯತೆ ಹುಡುಕಾಟ.',
          hi: 'सरकारी और निजी अस्पतालों में रीयल-टाइम बेड उपलब्धता खोज।'
        },
        steps: [
          {
            selector: '[data-service-filter="bedType"]',
            title: { en: 'Select Bed Type', kn: 'ಹಾಸಿಗೆ ವಿಧ ಆರಿಸಿ', hi: 'बेड का प्रकार चुनें' },
            desc: {
              en: 'Filter specifically for General Ward, ICU, Oxygen, or Ventilator beds based on clinical need.',
              kn: 'ಜನರಲ್ ವಾರ್ಡ್, ಐಸಿಯು, ಆಕ್ಸಿಜನ್ ಅಥವಾ ವೆಂಟಿಲೇಟರ್ ಹಾಸಿಗೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
              hi: 'जनरल वार्ड, आईसीयू, ऑक्सीजन या वेंटिलेटर बेड के अनुसार फ़िल्टर करें।'
            }
          },
          {
            selector: '[data-service-filter="bedDistance"]',
            title: { en: 'Distance Radius', kn: 'ದೂರದ ವ್ಯಾಪ್ತಿ', hi: 'दूरी की सीमा' },
            desc: {
              en: 'Filter hospitals within 5km, 10km, or 25km of your current location to minimize transit time.',
              kn: 'ಪ್ರಯಾಣದ ಸಮಯ ಕಡಿಮೆ ಮಾಡಲು 5ಕಿಮೀ, 10ಕಿಮೀ ಅಥವಾ 25ಕಿಮೀ ವ್ಯಾಪ್ತಿಯ ಆಸ್ಪತ್ರೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
              hi: 'नज़दीकी अस्पताल खोजने के लिए 5 किमी, 10 किमी या 25 किमी का दायरा चुनें।'
            }
          },
          {
            selector: '.resource-card, .hospital-card',
            title: { en: 'Hospital Cards & Live Metrics', kn: 'ಆಸ್ಪತ್ರೆ ಕಾರ್ಡ್ & ಮೆಟ್ರಿಕ್ಸ್‌', hi: 'अस्पताल कार्ड और विवरण' },
            desc: {
              en: 'Review live available bed counts, contact numbers, and address before traveling.',
              kn: 'ಆಸ್ಪತ್ರೆಗೆ ತೆರಳುವ ಮೊದಲು ಲಭ್ಯವಿರುವ ಹಾಸಿಗೆ ಸಂಖ್ಯೆ ಮತ್ತು ಸಂಪರ್ಕ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
              hi: 'यात्रा करने से पहले उपलब्ध बेड की संख्या और संपर्क विवरण की पुष्टि करें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'Can I reserve an ICU bed in advance?', kn: 'ಐಸಿಯು ಹಾಸಿಗೆಯನ್ನು ಮುಂಚಿತವಾಗಿ ಕಾಯ್ದಿರಿಸಬಹುದೇ?', hi: 'क्या मैं पहले से आईसीयू बेड आरक्षित कर सकता हूँ?' },
            a: {
              en: 'Emergency ICU admissions are prioritized based on clinical triage at arrival; use Emergency SOS to notify the hospital trauma bay in transit.',
              kn: 'ತುರ್ತು ಐಸಿಯು ಪ್ರವೇಶವನ್ನು ಆಗಮನದ ಸಮಯದಲ್ಲಿ ಆದ್ಯತೆ ನೀಡಲಾಗುತ್ತದೆ; ಆಸ್ಪತ್ರೆಗೆ ಮುನ್ಸೂಚನೆ ನೀಡಲು ತುರ್ತು SOS ಬಳಸಿ.',
              hi: 'आपातकालीन आईसीयू प्रवेश अस्पताल पहुंचने पर प्राथमिकता पर दिया जाता है; पूर्व सूचना के लिए आपातकालीन SOS का उपयोग करें।'
            }
          }
        ],
        tips: {
          en: 'Tip: Always verify ICU availability on the hospital card before transporting a critical patient.',
          kn: 'ಸಲಹೆ: ಗಂಭೀರ ರೋಗಿಯನ್ನು ಕರೆದೊಯ್ಯುವ ಮೊದಲು ಆಸ್ಪತ್ರೆ ಕಾರ್ಡ್‌ನಲ್ಲಿ ಐಸಿಯು ಲಭ್ಯತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
          hi: 'सुझाव: गंभीर मरीज़ को ले जाने से पहले अस्पताल कार्ड पर आईसीयू उपलब्धता अवश्य जांचें।'
        },
        related: ['home_patient', 'medicines', 'sos', 'ambulance_dashboard']
      },

      medicines: {
        id: 'medicines',
        category: 'Medicines & Supplies',
        icon: 'capsules',
        title: {
          en: 'Check Medicines & Jan Aushadhi',
          kn: 'ಔಷಧಿಗಳು & ಜನೌಷಧಿ ಪರಿಶೀಲನೆ',
          hi: 'दवाइयां और जन औषधि जांचें'
        },
        desc: {
          en: 'Locate essential and life-saving medicines across Jan Aushadhi Kendras and hospital pharmacies.',
          kn: 'ಜನೌಷಧಿ ಕೇಂದ್ರಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆ ಔಷಧಾಲಯಗಳಲ್ಲಿ ಅಗತ್ಯ ಔಷಧಿಗಳ ಲಭ್ಯತೆ ಪರಿಶೀಲಿಸಿ.',
          hi: 'जन औषधि केंद्रों और अस्पताल फार्मेसी में आवश्यक दवाओं की उपलब्धता खोजें।'
        },
        steps: [
          {
            selector: '[data-service-filter="query"]',
            title: { en: 'Search Generic or Brand', kn: 'ಔಷಧಿ ಹೆಸರು ನಮೂದಿಸಿ', hi: 'दवा का नाम खोजें' },
            desc: {
              en: 'Type generic salt name (e.g. Paracetamol, Metformin) or common brand name to find matches.',
              kn: 'ಔಷಧಿಯ ಜೆನೆರಿಕ್ ಹೆಸರು ಅಥವಾ ಬ್ರ್ಯಾಂಡ್ ಹೆಸರನ್ನು ನಮೂದಿಸಿ ಹುಡುಕಿ.',
              hi: 'जेनेरिक नाम या ब्रांड का नाम दर्ज करके दवा खोजें।'
            }
          },
          {
            selector: '[data-service-filter="medicineAvailableOnly"]',
            title: { en: 'In-Stock Only Filter', kn: 'ದಾಸ್ತಾನು ಇರುವಂತದ್ದು ಮಾತ್ರ', hi: 'केवल स्टॉक में उपलब्ध' },
            desc: {
              en: 'Check this box to instantly filter out pharmacies where stock is currently depleted.',
              kn: 'ದಾಸ್ತಾನು ಮುಗಿದಿರುವ ಅಂಗಡಿಗಳನ್ನು ಹೊರತುಪಡಿಸಿ ಲಭ್ಯವಿರುವ ಅಂಗಡಿಗಳನ್ನು ಮಾತ್ರ ವೀಕ್ಷಿಸಿ.',
              hi: 'जिन फार्मेसियों में स्टॉक खत्म हो गया है, उन्हें हटाकर केवल उपलब्ध स्टॉक देखें।'
            }
          },
          {
            selector: '[data-service-filter="medicineProvider"]',
            title: { en: 'Pharmacy Provider Filter', kn: 'ಔಷಧ ಪೂರೈಕೆದಾರರ ವಿಧ', hi: 'फार्मेसी प्रदाता फ़िल्टर' },
            desc: {
              en: 'Select Government Jan Aushadhi Kendra for affordable generic options up to 80% discounted.',
              kn: 'ಕೈಗೆಟುಕುವ ಬೆಲೆಯಲ್ಲಿ ಜೆನೆರಿಕ್ ಔಷಧಿ ಪಡೆಯಲು ಪ್ರಧಾನ ಮಂತ್ರಿ ಜನೌಷಧಿ ಕೇಂದ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
              hi: 'किफ़ायती दरों पर जेनेरिक दवाओं के लिए जन औषधि केंद्र चुनें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'What is a Jan Aushadhi Kendra?', kn: 'ಜನೌಷಧಿ ಕೇಂದ್ರ ಎಂದರೇನು?', hi: 'जन औषधि केंद्र क्या है?' },
            a: {
              en: 'Pradhan Mantri Bharatiya Janaushadhi Kendras provide government-quality generic medicines at 50% to 90% lower prices.',
              kn: 'ಪ್ರಧಾನಮಂತ್ರಿ ಭಾರತೀಯ ಜನೌಷಧಿ ಕೇಂದ್ರಗಳು 50% ರಿಂದ 90% ರಷ್ಟು ಕಡಿಮೆ ದರದಲ್ಲಿ ಗುಣಮಟ್ಟದ ಜೆನೆರಿಕ್ ಔಷಧಿಗಳನ್ನು ಒದಗಿಸುತ್ತವೆ.',
              hi: 'जन औषधि केंद्र 50% से 90% कम कीमत पर उच्च गुणवत्ता वाली जेनेरिक दवाएं प्रदान करते हैं।'
            }
          }
        ],
        tips: {
          en: 'Tip: Ask your doctor for the generic molecule name to save up to 80% at Jan Aushadhi stores.',
          kn: 'ಸಲಹೆ: ಜನೌಷಧಿ ಕೇಂದ್ರಗಳಲ್ಲಿ 80% ವರೆಗೆ ಉಳಿಸಲು ನಿಮ್ಮ ವೈದ್ಯರಿಂದ ಜೆನೆರಿಕ್ ಔಷಧಿಯ ಹೆಸರನ್ನು ಪಡೆಯಿರಿ.',
          hi: 'सुझाव: भारी बचत के लिए अपने डॉक्टर से दवा का जेनेरिक साल्ट नाम लिखने का अनुरोध करें।'
        },
        related: ['home_patient', 'beds', 'blood']
      },

      blood: {
        id: 'blood',
        category: 'Blood & Transfusion',
        icon: 'blood',
        title: {
          en: 'Blood Bank & Component Availability',
          kn: 'ರಕ್ತ ನಿಧಿ & ಲಭ್ಯತೆ',
          hi: 'ब्लड बैंक और घटक उपलब्धता'
        },
        desc: {
          en: 'Real-time blood component inventory (Whole Blood, PRBC, Platelets, FFP) and urgent shortage alerts.',
          kn: 'ರಕ್ತದ ಘಟಕಗಳ (ಸಂಪೂರ್ಣ ರಕ್ತ, ಪ್ಲೇಟ್‌ಲೆಟ್ಸ್, ಪ್ಲಾಸ್ಮಾ) ನೈಜ ಸಮಯದ ಸಂಗ್ರಹ ಮಾಹಿತಿ.',
          hi: 'रीयल-टाइम ब्लड कंपोनेंट (होल ब्लड, प्लेटलेट्स, प्लाज्मा) और कमी अलर्ट की जांच करें।'
        },
        steps: [
          {
            selector: '.blood-grid, .service-results',
            title: { en: 'Inspect ABO/Rh Groups', kn: 'ರಕ್ತದ ಗುಂಪು ಆಯ್ಕೆ', hi: 'रक्त समूह चुनें' },
            desc: {
              en: 'Quickly verify unit counts for A+, A-, B+, B-, O+, O-, AB+, and AB- components.',
              kn: 'A+, B+, O+, AB+ ಮುಂತಾದ ರಕ್ತದ ಗುಂಪುಗಳ ಲಭ್ಯವಿರುವ ಯೂನಿಟ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',
              hi: 'A+, B+, O+, AB+ आदि रक्त समूहों के उपलब्ध यूनिटों की संख्या जांचें।'
            }
          },
          {
            selector: '.shortage-card, .status-badge',
            title: { en: 'Critical Shortage Indicators', kn: 'ತುರ್ತು ಕೊರತೆ ಸೂಚನೆ', hi: 'गंभीर कमी संकेतक' },
            desc: {
              en: 'Amber and Crimson indicators show high-demand or depleted units requiring voluntary donors.',
              kn: 'ಕೆಂಪು ಮತ್ತು ಹಳದಿ ಬಣ್ಣದ ಸೂಚಕಗಳು ತೀವ್ರ ಕೊರತೆಯನ್ನು ಸೂಚಿಸುತ್ತವೆ.',
              hi: 'लाल और पीले संकेतक उन रक्त समूहों को दर्शाते हैं जहां तुरंत दाताओं की आवश्यकता है।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'Who can donate blood?', kn: 'ಯಾರು ರಕ್ತದಾನ ಮಾಡಬಹುದು?', hi: 'रक्तदान कौन कर सकता है?' },
            a: {
              en: 'Healthy adults aged 18–65 weighing over 45 kg with normal vitals and no recent infections.',
              kn: '18 ರಿಂದ 65 ವರ್ಷದೊಳಗಿನ ಆರೋಗ್ಯವಂತ ವ್ಯಕ್ತಿಗಳು ರಕ್ತದಾನ ಮಾಡಬಹುದು.',
              hi: '18 से 65 वर्ष के स्वस्थ व्यक्ति जिनका वजन 45 किलोग्राम से अधिक हो, रक्तदान कर सकते हैं।'
            }
          }
        ],
        tips: {
          en: 'Tip: O-negative is the universal red blood cell donor, vital in emergency trauma resuscitations.',
          kn: 'ಸಲಹೆ: ಒ-ನೆಗೆಟಿವ್ ಸಾರ್ವತ್ರಿಕ ರಕ್ತದಾನಿ ರಕ್ತವಾಗಿದ್ದು, ತುರ್ತು ಸಮಯದಲ್ಲಿ ಅತ್ಯಂತ ಮುಖ್ಯವಾಗಿದೆ.',
          hi: 'सुझाव: ओ-नेगेटिव यूनिवर्सल डोनर है, जो आपातकालीन ट्रामा में जीवनरक्षक होता है।'
        },
        related: ['home_patient', 'beds', 'sos']
      },

      appointments: {
        id: 'appointments',
        category: 'Consultations',
        icon: 'equipment',
        title: {
          en: 'Doctor Consultations & Booking',
          kn: 'ವೈದ್ಯರ ಭೇಟಿ & ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್',
          hi: 'डॉक्टर परामर्श और बुकिंग'
        },
        desc: {
          en: 'Schedule in-person OPD appointments or telemedicine video consultations with verified specialists.',
          kn: 'ಪರಿಶೀಲಿತ ತಜ್ಞ ವೈದ್ಯರೊಂದಿಗೆ ಒಪಿಡಿ ಅಥವಾ ಟೆಲಿಮೆಡಿಸಿನ್ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ನಿಗದಿಪಡಿಸಿ.',
          hi: 'विशेषज्ञ डॉक्टरों के साथ ओपीडी या टेलीमेडिसिन वीडियो परामर्श बुक करें।'
        },
        steps: [
          {
            selector: '#content button, .book-appointment-btn',
            title: { en: 'Schedule Appointment', kn: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ', hi: 'अपॉइंटमेंट बुक करें' },
            desc: {
              en: 'Select clinical specialty, preferred doctor, hospital clinic, and convenient date and time slot.',
              kn: 'ವಿಶೇಷತೆ, ವೈದ್ಯರು, ಆಸ್ಪತ್ರೆ ಮತ್ತು ಅನುಕೂಲಕರ ದಿನಾಂಕ-ಸಮಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
              hi: 'विशेषज्ञता, डॉक्टर, अस्पताल और अपनी सुविधानुसार समय स्लॉट चुनें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'Are government OPD visits free?', kn: 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆ ಒಪಿಡಿ ಭೇಟಿ ಉಚಿತವೇ?', hi: 'क्या सरकारी ओपीडी परामर्श मुफ़्त है?' },
            a: {
              en: 'Yes, government district and general hospital OPD registrations are completely free of charge.',
              kn: 'ಹೌದು, ಸರ್ಕಾರಿ ಜಿಲ್ಲಾ ಮತ್ತು ಜನರಲ್ ಆಸ್ಪತ್ರೆಗಳ ಒಪಿಡಿ ನೋಂದಣಿ ಉಚಿತವಾಗಿದೆ.',
              hi: 'हाँ, सरकारी जिला और सामान्य अस्पतालों में ओपीडी पंजीकरण पूरी तरह से निःशुल्क है।'
            }
          }
        ],
        tips: {
          en: 'Tip: Arrive 15 minutes before your booked OPD token slot to complete basic vitals screening.',
          kn: 'ಸಲಹೆ: ಮೂಲ ತಪಾಸಣೆ ಪೂರ್ಣಗೊಳಿಸಲು ನಿಮ್ಮ ಒಪಿಡಿ ಸಮಯಕ್ಕಿಂತ 15 ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ತಲುಪಿ.',
          hi: 'सुझाव: बुनियादी जांच के लिए अपने बुक किए गए ओपीडी समय से 15 मिनट पहले पहुंचें।'
        },
        related: ['home_patient', 'beds', 'records']
      },

      sos: {
        id: 'sos',
        category: 'Emergency Care',
        icon: 'ambulance',
        title: {
          en: 'Emergency SOS & Trauma Dispatch',
          kn: 'ತುರ್ತು SOS & ಆಂಬ್ಯುಲೆನ್ಸ್',
          hi: 'आपातकालीन SOS और एम्बुलेंस'
        },
        desc: {
          en: 'Priority emergency response dispatching 108 Advanced Life Support ambulances and alerting nearby trauma centers.',
          kn: '108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ಹತ್ತಿರದ ಟ್ರಾಮಾ ಸೆಂಟರ್‌ಗಳಿಗೆ ತುರ್ತು ಎಚ್ಚರಿಕೆ ರವಾನಿಸುವ ವ್ಯವಸ್ಥೆ.',
          hi: '108 एम्बुलेंस और निकटतम ट्रामा सेंटर को तुरंत अलर्ट भेजने वाली आपातकालीन प्रणाली।'
        },
        steps: [
          {
            selector: '.topbar-emergency-btn, #sosModal',
            title: { en: '1-Tap Emergency Trigger', kn: '1-ಟ್ಯಾಪ್ ತುರ್ತು ಕರೆ', hi: '1-टैप आपातकालीन बटन' },
            desc: {
              en: 'Immediately dials 108 Medical Emergency or 112 Unified Emergency command.',
              kn: '108 ವೈದ್ಯಕೀಯ ತುರ್ತು ಅಥವಾ 112 ತುರ್ತು ಸಂಖ್ಯೆಗೆ ನೇರ ಕರೆ ಮಾಡುತ್ತದೆ.',
              hi: 'तुरंत 108 मेडिकल इमरजेंसी या 112 हेल्पलाइन पर कॉल करें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'Does calling 108 cost money?', kn: '108 ಕರೆ ಮಾಡಲು ಹಣ ಪಾವತಿಸಬೇಕೇ?', hi: 'क्या 108 पर कॉल करने का कोई शुल्क है?' },
            a: {
              en: 'No. 108 Emergency Medical Service is 100% toll-free and operates 24/7 across the state.',
              kn: 'ಇಲ್ಲ. 108 ತುರ್ತು ಸೇವೆ ಸಂಪೂರ್ಣ ಉಚಿತ ಮತ್ತು 24/7 ಲಭ್ಯವಿದೆ.',
              hi: 'नहीं। 108 आपातकालीन सेवा 100% मुफ़्त है और 24/7 उपलब्ध है।'
            }
          }
        ],
        tips: {
          en: 'Tip: Keep your GPS active on mobile so 108 dispatchers can route the nearest ambulance directly to your location.',
          kn: 'ಸಲಹೆ: ಆಂಬ್ಯುಲೆನ್ಸ್ ಸುಲಭವಾಗಿ ತಲುಪಲು ನಿಮ್ಮ ಮೊಬೈಲ್ ಜಿಪಿಎಸ್ ಆನ್ ಆಗಿರಿಸಿ.',
          hi: 'सुझाव: अपने मोबाइल का जीपीएस चालू रखें ताकि एम्बुलेंस सीधे आपके स्थान पर पहुंच सके।'
        },
        related: ['home_patient', 'beds', 'blood']
      },

      doctor_dashboard: {
        id: 'doctor_dashboard',
        category: 'Clinical Workflows',
        icon: 'cross',
        title: {
          en: 'Doctor Clinical Workspace',
          kn: 'ವೈದ್ಯರ ಕ್ಲಿನಿಕಲ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
          hi: 'डॉक्टर क्लिनिकल वर्कस्पेस'
        },
        desc: {
          en: 'Manage inpatient rosters, review assigned OPD queues, issue digital prescriptions, and handle tertiary referrals.',
          kn: 'ರೋಗಿಗಳ ದಾಖಲೆ, ಒಪಿಡಿ ಕ್ಯೂ, ಡಿಜಿಟಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಮತ್ತು ಶಿಫಾರಸುಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
          hi: 'मरीज़ों की सूची, ओपीडी कतार, डिजिटल नुस्खे और रेफ़रल प्रबंधित करें।'
        },
        steps: [
          {
            selector: '#content',
            title: { en: 'Active OPD & Ward Roster', kn: 'ಸಕ್ರಿಯ ಒಪಿಡಿ & ವಾರ್ಡ್ ಪಟ್ಟಿ', hi: 'सक्रिय ओपीडी और वार्ड रोस्टर' },
            desc: {
              en: 'Review assigned patients, chief complaints, and pending diagnostic lab orders.',
              kn: 'ರೋಗಿಗಳ ವಿವರ, ದೂರುಗಳು ಮತ್ತು ಬಾಕಿ ಇರುವ ಲ್ಯಾಬ್ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
              hi: 'मरीज़ों की समस्याएं और लंबित लैब रिपोर्ट की समीक्षा करें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'How are digital prescriptions signed?', kn: 'ಡಿಜಿಟಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗೆ ಸಹಿ ಹಾಕುವುದು ಹೇಗೆ?', hi: 'डिजिटल नुस्खे कैसे हस्ताक्षरित होते हैं?' },
            a: {
              en: 'CareSphere e-prescriptions are timestamped and tied to your verified Medical Council Registration ID.',
              kn: 'ಕೇರ್‌ಸ್ಪಿಯರ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್‌ಗಳು ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಪರಿಷತ್ತಿನ ನೋಂದಣಿ ಐಡಿಗೆ ಲಿಂಕ್ ಆಗಿರುತ್ತವೆ.',
              hi: 'केयरस्फीयर ई-प्रिस्क्रिप्शन आपके मेडिकल काउंसिल रजिस्ट्रेशन नंबर से जुड़े होते हैं।'
            }
          }
        ],
        tips: {
          en: 'Tip: High-priority referral alerts blink with amber badges in your consultation queue.',
          kn: 'ಸಲಹೆ: ತುರ್ತು ಶಿಫಾರಸು ಪ್ರಕರಣಗಳು ನಿಮ್ಮ ಪಟ್ಟಿಯಲ್ಲಿ ಹಳದಿ ಬಣ್ಣದ ಬ್ಯಾಡ್ಜ್‌ನೊಂದಿಗೆ ಕಾಣಿಸುತ್ತವೆ.',
          hi: 'सुझाव: उच्च प्राथमिकता वाले रेफ़रल मामलों पर विशेष बैज दिखाई देता है।'
        },
        related: ['appointments', 'records', 'beds']
      },

      hospital_dashboard: {
        id: 'hospital_dashboard',
        category: 'Hospital Administration',
        icon: 'hospital',
        title: {
          en: 'Hospital Bed & Facility Command',
          kn: 'ಆಸ್ಪತ್ರೆ ಹಾಸಿಗೆ & ಸಂಪನ್ಮೂಲ ನಿರ್ವಹಣೆ',
          hi: 'अस्पताल बेड और संसाधन प्रबंधन'
        },
        desc: {
          en: 'Live telemetry of General, ICU, and Oxygen beds, duty rosters, oxygen cylinder pressure, and admissions.',
          kn: 'ಜನರಲ್, ಐಸಿಯು, ಆಕ್ಸಿಜನ್ ಹಾಸಿಗೆಗಳು ಮತ್ತು ಆಸ್ಪತ್ರೆ ಸಂಪನ್ಮೂಲಗಳ ನೈಜ ನಿರ್ವಹಣೆ.',
          hi: 'जनरल, आईसीयू और ऑक्सीजन बेड, ड्यूटी रोस्टर और प्रवेश का प्रबंधन।'
        },
        steps: [
          {
            selector: '#content',
            title: { en: 'Bed Inventory & Occupancy Meters', kn: 'ಹಾಸಿಗೆ ದಾಸ್ತಾನು ಮೀಟರ್ಸ್', hi: 'बेड क्षमता और मीटर' },
            desc: {
              en: 'Update live admissions and discharges to maintain district-wide accuracy.',
              kn: 'ಜಿಲ್ಲಾ ಮಟ್ಟದ ನಿಖರತೆಗಾಗಿ ದಾಖಲಾತಿ ಮತ್ತು ಡಿಸ್ಚಾರ್ಜ್ ವಿವರಗಳನ್ನು ನವೀಕರಿಸಿ.',
              hi: 'सटीक जानकारी बनाए रखने के लिए मरीज़ों के प्रवेश और डिस्चार्ज की स्थिति अपडेट करें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'How often should bed counts be refreshed?', kn: 'ಹಾಸಿಗೆ ಸಂಖ್ಯೆಯನ್ನು ಎಷ್ಟು ಬಾರಿ ನವೀಕರಿಸಬೇಕು?', hi: 'बेड संख्या को कितनी बार अपडेट करना चाहिए?' },
            a: {
              en: 'Government protocols mandate updates upon every patient admission or discharge, with auto-sync verification every 15 minutes.',
              kn: 'ಪ್ರತಿ ರೋಗಿಯ ಪ್ರವೇಶ ಅಥವಾ ಬಿಡುಗಡೆಯ ಸಮಯದಲ್ಲಿ ತಕ್ಷಣವೇ ನವೀಕರಿಸಬೇಕು.',
              hi: 'प्रत्येक मरीज़ के प्रवेश या डिस्चार्ज पर तुरंत अपडेट करना आवश्यक है।'
            }
          }
        ],
        tips: {
          en: 'Tip: Use PredictAI in your navigation tab to forecast surge admissions for upcoming holiday weekends.',
          kn: 'ಸಲಹೆ: ರಜಾದಿನಗಳ ಹೆಚ್ಚುವರಿ ರೋಗಿಗಳನ್ನು ಅಂದಾಜಿಸಲು ಪ್ರೆಡಿಕ್ಟ್ ಎಐ ಬಳಸಿ.',
          hi: 'सुझाव: आगामी दिनों में मरीज़ों की आमद का पूर्वानुमान लगाने के लिए PredictAI का उपयोग करें।'
        },
        related: ['beds', 'doctor_dashboard', 'blood_dashboard']
      },

      ambulance_dashboard: {
        id: 'ambulance_dashboard',
        category: 'Emergency Dispatch',
        icon: 'ambulance',
        title: {
          en: 'Emergency Ambulance Fleet Command',
          kn: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ತುರ್ತು ನಿಯಂತ್ರಣ',
          hi: 'एम्बुलेंस बेड़ा और आपातकालीन नियंत्रण'
        },
        desc: {
          en: 'Accept incoming 108 SOS calls, track live patient GPS coordinates, and transmit en-route vitals to destination hospitals.',
          kn: '108 ಕರೆಗಳನ್ನು ಸ್ವೀಕರಿಸಿ, ಜಿಪಿಎಸ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಆಸ್ಪತ್ರೆಗೆ ರೋಗಿಯ ಸ್ಥಿತಿ ತಿಳಿಸಿ.',
          hi: '108 कॉल स्वीकार करें, लाइव लोकेशन ट्रैक करें और गंतव्य अस्पताल को पूर्व सूचना दें।'
        },
        steps: [
          {
            selector: '#content',
            title: { en: 'Emergency Requisition Queue', kn: 'ತುರ್ತು ವಿನಂತಿ ಕ್ಯೂ', hi: 'आपातकालीन कॉल कतार' },
            desc: {
              en: 'Accept high-priority trauma, cardiac, or maternal emergency dispatches.',
              kn: 'ಗಂಭೀರ ಅಪಘಾತ, ಹೃದಯಾಘಾತ ಅಥವಾ ಹೆರಿಗೆ ಸಂಬಂಧಿತ ತುರ್ತು ಕರೆಗಳನ್ನು ಸ್ವೀಕರಿಸಿ.',
              hi: 'गंभीर आघात, हृदय रोग या प्रसूति आपातकालीन मामलों को स्वीकार करें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'How does hospital pre-arrival notification work?', kn: 'ಆಸ್ಪತ್ರೆಗೆ ಮುನ್ಸೂಚನೆ ನೀಡುವುದು ಹೇಗೆ?', hi: 'अस्पताल को पूर्व सूचना कैसे मिलती है?' },
            a: {
              en: 'Tapping "En Route" sends the patient triage code and estimated arrival time directly to the receiving emergency triage desk.',
              kn: 'ಎನ್-ರೂಟ್ ಬಟನ್ ಒತ್ತುವುದರಿಂದ ಆಸ್ಪತ್ರೆಗೆ ರೋಗಿಯ ಆಗಮನದ ಸಮಯ ತಲುಪುತ್ತದೆ.',
              hi: 'एन-रूट दबाने से प्राप्तकर्ता अस्पताल को मरीज़ की स्थिति और आगमन समय प्राप्त हो जाता है।'
            }
          }
        ],
        tips: {
          en: 'Tip: Verify red emergency triage flags to pre-alert cardiac catheterization or trauma teams.',
          kn: 'ಸಲಹೆ: ತುರ್ತು ಕೆಂಪು ಧ್ವಜವನ್ನು ಪರಿಶೀಲಿಸಿ ಟ್ರಾಮಾ ತಂಡವನ್ನು ಸಿದ್ಧವಾಗಿರಲು ತಿಳಿಸಿ.',
          hi: 'सुझाव: आपातकालीन मामलों के लिए अस्पताल की टीम को पहले से सतर्क करें।'
        },
        related: ['sos', 'beds', 'hospital_dashboard']
      },

      government_dashboard: {
        id: 'government_dashboard',
        category: 'Public Health Command',
        icon: 'ai',
        title: {
          en: 'Public Health Telemetry & Command Center',
          kn: 'ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ',
          hi: 'सार्वजनिक स्वास्थ्य कमान केंद्र'
        },
        desc: {
          en: 'District-wide healthcare capacity, disease cluster monitoring, scheme claim velocity, and bed utilization audits.',
          kn: 'ಜಿಲ್ಲಾ ಮಟ್ಟದ ಆರೋಗ್ಯ ಸಾಮರ್ಥ್ಯ, ಕಾಯಿಲೆಗಳ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಸೌಲಭ್ಯಗಳ ಪರಿಶೀಲನೆ.',
          hi: 'ज़िला-स्तरीय स्वास्थ्य क्षमता, रोग निगरानी और बेड उपयोग का ऑडिट।'
        },
        steps: [
          {
            selector: '#content',
            title: { en: 'Statewide Health Metrics', kn: 'ರಾಜ್ಯಮಟ್ಟದ ಆರೋಗ್ಯ ಮೆಟ್ರಿಕ್ಸ್', hi: 'राज्य-स्तरीय स्वास्थ्य आंकड़े' },
            desc: {
              en: 'Monitor bed occupancy rates, oxygen tank reserves, and regional supply chain stress levels.',
              kn: 'ಹಾಸಿಗೆ ಲಭ್ಯತೆ, ಆಕ್ಸಿಜನ್ ದಾಸ್ತಾನು ಮತ್ತು ಪೂರೈಕೆ ಸ್ಥಿತಿಯನ್ನು ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಿ.',
              hi: 'बेड उपलब्धता, ऑक्सीजन भंडार और आपूर्ति श्रृंखला की निगरानी करें।'
            }
          }
        ],
        faqs: [
          {
            q: { en: 'Where do PredictAI models source data?', kn: 'ಪ್ರೆಡಿಕ್ಟ್ ಎಐ ಡೇಟಾ ಎಲ್ಲಿಂದ ಪಡೆಯುತ್ತದೆ?', hi: 'PredictAI डेटा कहाँ से लेता है?' },
            a: {
              en: 'PredictAI processes anonymized OPD admissions, disease surveillance vectors (IDSP), and weather patterns without exposing private patient health records.',
              kn: 'ಪ್ರೆಡಿಕ್ಟ್ ಎಐ ಸಾರ್ವಜನಿಕ ಆರೋಗ್ಯ ದತ್ತಾಂಶ ಮತ್ತು ಪ್ರವೇಶ ದಾಖಲೆಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.',
              hi: 'PredictAI सार्वजनिक स्वास्थ्य डेटा और प्रवेश रुझानों का विश्लेषण करता है।'
            }
          }
        ],
        tips: {
          en: 'Tip: Export weekly hospital compliance reports using the top-right export button in Analytics.',
          kn: 'ಸಲಹೆ: ಅನಾಲಿಟಿಕ್ಸ್‌ನಲ್ಲಿ ಸಾಪ್ತಾಹಿಕ ವರದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಿ.',
          hi: 'सुझाव: एनालिटिक्स से साप्ताहिक अस्पताल अनुपालन रिपोर्ट डाउनलोड करें।'
        },
        related: ['hospital_dashboard', 'beds', 'ambulance_dashboard']
      }
    },

    // 2. Initialize the Guide System
    init: function() {
      // Load saved progress
      try {
        const saved = JSON.parse(localStorage.getItem('caresphere-guide-progress') || 'null');
        if (saved && Array.isArray(saved.completed)) {
          this.state.progress = saved;
        }
      } catch (e) {
        console.warn('CareSphere Guide progress could not be parsed from localStorage.');
      }

      // Read current language from document or data-language selectors
      const langSel = document.querySelector('[data-language]');
      if (langSel && langSel.value) {
        this.state.language = langSel.value;
      }

      // Listen for language change events
      window.addEventListener('caresphere:language', (e) => {
        if (e.detail && e.detail.language) {
          this.state.language = e.detail.language;
          this.updateLanguage(e.detail.language);
        }
      });

      // Inject floating assistant trigger button
      this.injectFloatingAssistant();

      // Inject slide-over guide drawer
      this.injectDrawer();

      // Listen for visibility state and observe DOM to restrict guide to main app page only
      this.updateVisibility();
      try {
        const obs = new MutationObserver(() => this.updateVisibility());
        obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        const appEl = document.getElementById('careApp');
        if (appEl) obs.observe(appEl, { attributes: true, attributeFilter: ['aria-hidden', 'inert', 'style'] });
        const onbEl = document.getElementById('onboarding');
        if (onbEl) obs.observe(onbEl, { attributes: true, attributeFilter: ['class', 'style'] });
        const expEl = document.getElementById('brandExperience');
        if (expEl) obs.observe(expEl, { attributes: true, attributeFilter: ['hidden', 'aria-hidden', 'class'] });
      } catch (err) {
        window.setInterval(() => this.updateVisibility(), 800);
      }

      // Keyboard shortcut listener (Press "?" or "Shift+/" to toggle guide, "Esc" to close)
      document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
          if (!this.isMainAppVisible()) return;
          e.preventDefault();
          this.toggleDrawer();
        } else if (e.key === 'Escape') {
          if (this.state.tourActive) {
            this.endWalkthrough();
          } else if (this.state.drawerOpen) {
            this.closeDrawer();
          }
        }
      });
    },

    isMainAppVisible: function() {
      const intro = document.getElementById('brandExperience');
      if (intro && !intro.hidden && intro.getAttribute('aria-hidden') !== 'true') return false;
      if (document.body.classList.contains('has-intro')) return false;
      const onboarding = document.getElementById('onboarding');
      if (onboarding && onboarding.classList.contains('is-open')) return false;
      const careApp = document.getElementById('careApp');
      if (careApp && (careApp.getAttribute('aria-hidden') === 'true' || careApp.hasAttribute('inert'))) return false;
      return true;
    },

    updateVisibility: function() {
      const trigger = document.getElementById('floatingGuideAssistant');
      if (!trigger) return;
      const isMain = this.isMainAppVisible();
      trigger.style.display = isMain ? 'flex' : 'none';
      if (!isMain && this.state.drawerOpen) {
        this.closeDrawer();
      }
    },

    // Helper: translate registry string
    t: function(obj) {
      if (!obj) return '';
      if (typeof obj === 'string') return obj;
      return obj[this.state.language] || obj.en || '';
    },

    // 3. Post-Onboarding 3D Interactive Guide (shown after details are entered, before main page)
    showPostOnboardingGuide: function(userProfile, role, onContinue) {
      const self = this;
      const lang = this.state.language;
      const profileName = (userProfile && userProfile.name) ? userProfile.name.split(' ')[0] : 'Citizen';
      const roleKey = role || this.state.currentRole || 'patient';

      const roleDisplayNames = {
        patient: { en: 'Patient / Citizen', kn: 'ರೋಗಿ / ನಾಗರಿಕ', hi: 'मरीज़ / नागरिक' },
        doctor: { en: 'Doctor / Specialist', kn: 'ವೈದ್ಯರು / ತಜ್ಞರು', hi: 'डॉक्टर / विशेषज्ञ' },
        nurse: { en: 'Nurse / Medical Staff', kn: 'ನರ್ಸ್ / ಸಿಬ್ಬಂದಿ', hi: 'नर्स / स्टाफ' },
        hospital: { en: 'Hospital Administrator', kn: 'ಆಸ್ಪತ್ರೆ ಆಡಳಿತಾಧಿಕಾರಿ', hi: 'अस्पताल प्रशासक' },
        ambulance: { en: 'Ambulance Emergency Staff', kn: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಸಿಬ್ಬಂದಿ', hi: 'एम्बुलेंस स्टाफ' },
        blood: { en: 'Blood Bank Officer', kn: 'ರಕ್ತನಿಧಿ ಅಧಿಕಾರಿ', hi: 'ब्लड बैंक अधिकारी' },
        supplier: { en: 'Medical Supplier / Pharmacy', kn: 'ಔಷಧ ಪೂರೈಕೆದಾರ', hi: 'दवा आपूर्तिकर्ता' },
        government: { en: 'Government Health Official', kn: 'ಸರ್ಕಾರಿ ಆರೋಗ್ಯ ಅಧಿಕಾರಿ', hi: 'सरकारी स्वास्थ्य अधिकारी' },
        admin: { en: 'System Administrator', kn: 'ಸಿಸ್ಟಂ ನಿರ್ವಾಹಕರು', hi: 'सिस्टम व्यवस्थापक' }
      };

      const roleRoleData = roleDisplayNames[roleKey] || roleDisplayNames.patient;
      const roleLabel = roleRoleData[lang] || roleRoleData.en;

      // Build 3 role-specific highlight cards
      const featurePillars = self.getRolePillars(roleKey);

      // Create overlay if not present
      let overlay = document.getElementById('guideOnboardingOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'guideOnboardingOverlay';
        overlay.className = 'guide-modal-overlay';
        document.body.appendChild(overlay);
      }

      const assistantSvg = (window.CareSphere3D && typeof window.CareSphere3D.svg === 'function')
        ? window.CareSphere3D.svg('assistant', { width: 68, height: 68 })
        : '🤖';

      overlay.innerHTML = `
        <div class="guide-onboarding-shell" role="dialog" aria-modal="true" aria-labelledby="postGuideTitle">
          <header class="guide-onboarding-hero">
            <div class="guide-assistant-avatar" aria-hidden="true">
              ${assistantSvg}
            </div>
            <div class="guide-onboarding-meta">
              <span class="guide-badge-pill">
                <span style="color:#10B981">●</span> ${roleLabel}
              </span>
              <h2 class="guide-onboarding-title" id="postGuideTitle">
                ${lang === 'kn' ? `ಕೇರ್‌ಸ್ಪಿಯರ್‌ಗೆ ಸುಸ್ವಾಗತ, ${profileName}!` : (lang === 'hi' ? `केयरस्फीयर में आपका स्वागत है, ${profileName}!` : `Welcome to CareSphere, ${profileName}!`)}
              </h2>
              <p class="guide-onboarding-desc">
                ${lang === 'kn' ? `ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ರಚನೆಯಾಗಿದೆ. ನಿಮ್ಮ ಪಾತ್ರಕ್ಕೆ ತಕ್ಕಂತೆ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ವೈಶಿಷ್ಟ್ಯಗಳ ಪರಿಚಯ ಇಲ್ಲಿದೆ.` : (lang === 'hi' ? `आपकी प्रोफ़ाइल तैयार है। यहाँ आपकी भूमिका के अनुसार मुख्य सुविधाओं की मार्गदर्शिका दी गई है।` : `Your profile is verified and active. Here is your personalized quick guide to help you get the most out of CareSphere.`)}
              </p>
            </div>
          </header>

          <div class="guide-progress-card">
            <div class="guide-progress-info">
              <span style="font-size:16px">🎓</span>
              <span>${lang === 'kn' ? 'ಪ್ರೊಫೈಲ್ ಸ್ಥಿತಿ: <strong>ಸಿದ್ಧವಾಗಿದೆ</strong> · ಕೇರ್‌ಗೈಡ್ ಲಭ್ಯವಿದೆ' : (lang === 'hi' ? 'प्रोफ़ाइल स्थिति: <strong>सक्रिय</strong> · केयरगाइड तैयार' : 'Profile Status: <strong>100% Ready</strong> · Intelligent CareGuide Unlocked')}</span>
            </div>
            <div class="guide-progress-bar-wrap" title="Learning Progress: 25%">
              <div class="guide-progress-bar-fill" style="width: 35%"></div>
            </div>
          </div>

          <div class="guide-features-grid">
            ${featurePillars.map(p => `
              <div class="guide-feature-card">
                <div>
                  <div class="guide-feature-icon">
                    ${(window.CareSphere3D && typeof window.CareSphere3D.svg === 'function') ? window.CareSphere3D.svg(p.icon, { width: 38, height: 38 }) : '✚'}
                  </div>
                  <h4 class="guide-feature-title">${p.title[lang] || p.title.en}</h4>
                  <p class="guide-feature-text">${p.desc[lang] || p.desc.en}</p>
                </div>
                <span class="guide-feature-tag">${p.tag[lang] || p.tag.en}</span>
              </div>
            `).join('')}
          </div>

          <footer class="guide-onboarding-actions">
            <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
              <button class="guide-onboarding-primary" type="button" id="guideEnterAppBtn">
                ${lang === 'kn' ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ' : (lang === 'hi' ? 'डैशबोर्ड में प्रवेश करें' : 'Enter CareSphere Dashboard')} <span aria-hidden="true">→</span>
              </button>
              <button class="guide-onboarding-tour-btn" type="button" id="guideLaunchTourBtn">
                <span aria-hidden="true">▶</span> ${lang === 'kn' ? '2-ನಿಮಿಷದ ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಟೂರ್' : (lang === 'hi' ? '2-मिनट का लाइव टूर शुरू करें' : 'Start 2-Minute Interactive Tour')}
              </button>
            </div>
            <div class="guide-onboarding-lang">
              <span>🌐</span>
              <button type="button" class="splash-lang-chip ${lang === 'en' ? 'active' : ''}" data-post-lang="en">EN</button>
              <button type="button" class="splash-lang-chip ${lang === 'kn' ? 'active' : ''}" data-post-lang="kn">ಕನ್ನಡ</button>
              <button type="button" class="splash-lang-chip ${lang === 'hi' ? 'active' : ''}" data-post-lang="hi">हिंदी</button>
            </div>
          </footer>
        </div>
      `;

      overlay.removeAttribute('hidden');

      // Bind Language Switcher inside Post-Onboarding Guide
      overlay.querySelectorAll('[data-post-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
          const newLang = btn.dataset.postLang;
          self.state.language = newLang;
          document.querySelectorAll('[data-language]').forEach(s => { s.value = newLang; });
          window.dispatchEvent(new CustomEvent('caresphere:language', { detail: { language: newLang } }));
          self.showPostOnboardingGuide(userProfile, role, onContinue);
        });
      });

      // Bind "Enter Dashboard"
      document.getElementById('guideEnterAppBtn').addEventListener('click', () => {
        overlay.setAttribute('hidden', 'true');
        if (typeof onContinue === 'function') {
          onContinue();
        }
        self.showFloatingToast(lang === 'kn' ? 'ಕೇರ್‌ಗೈಡ್ ಸದಾ ಲಭ್ಯವಿದೆ. ಸಹಾಯಕ್ಕಾಗಿ ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ!' : (lang === 'hi' ? 'केयरगाइड सक्रिय है। सहायता के लिए नीचे दिए गए बटन पर टैप करें!' : 'CareGuide is active! Tap the assistant in the corner anytime.'));
      });

      // Bind "Start Interactive Tour"
      document.getElementById('guideLaunchTourBtn').addEventListener('click', () => {
        overlay.setAttribute('hidden', 'true');
        if (typeof onContinue === 'function') {
          onContinue();
        }
        window.setTimeout(() => {
          self.startWalkthrough('home_patient');
        }, 600);
      });
    },

    // 4. Role-specific Feature Pillars
    getRolePillars: function(role) {
      switch(role) {
        case 'doctor':
          return [
            {
              icon: 'cross',
              title: { en: 'Patient Clinical Queue', kn: 'ರೋಗಿಗಳ ಕ್ಲಿನಿಕಲ್ ಪಟ್ಟಿ', hi: 'मरीज़ क्लिनिकल कतार' },
              desc: { en: 'Access real-time patient charts, vital telemetry, and lab review orders.', kn: 'ರೋಗಿಗಳ ಚಾರ್ಟ್, ಪ್ರಮುಖ ಲಕ್ಷಣಗಳು ಮತ್ತು ಲ್ಯಾಬ್ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.', hi: 'मरीज़ के चार्ट, वाइटल टेलीमेट्री और लैब रिपोर्ट देखें।' },
              tag: { en: 'OPD & Wards', kn: 'ಒಪಿಡಿ & ವಾರ್ಡ್‌ಗಳು', hi: 'ओपीडी और वार्ड' }
            },
            {
              icon: 'capsules',
              title: { en: 'E-Prescriptions & Rx', kn: 'ಡಿಜಿಟಲ್ ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್', hi: 'डिजिटल नुस्खा' },
              desc: { en: 'Issue authenticated prescriptions dispatching directly to Jan Aushadhi pharmacies.', kn: 'ಜನೌಷಧಿ ಕೇಂದ್ರಗಳಿಗೆ ನೇರವಾಗಿ ತಲುಪುವ ಇ-ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ನೀಡಿ.', hi: 'प्रमाणित ई-प्रिस्क्रिप्शन सीधे फार्मेसी में भेजें।' },
              tag: { en: 'Zero Paperwork', kn: 'ಕಾಗದರಹಿತ', hi: 'पेपरलेस' }
            },
            {
              icon: 'network',
              title: { en: 'Tertiary Referrals', kn: 'ಆಸ್ಪತ್ರೆ ಶಿಫಾರಸುಗಳು', hi: 'रेफ़रल प्रबंधन' },
              desc: { en: 'Seamlessly transfer critical cases to state medical colleges with full history.', kn: 'ಪೂರ್ಣ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸದೊಂದಿಗೆ ರೋಗಿಗಳನ್ನು ಉನ್ನತ ಆಸ್ಪತ್ರೆಗೆ ವರ್ಗಾಯಿಸಿ.', hi: 'गंभीर मामलों को राज्य के मेडिकल कॉलेजों में रेफ़र करें।' },
              tag: { en: 'Unified Network', kn: 'ಸಂಪರ್ಕಿತ ಜಾಲ', hi: 'एकीकृत नेटवर्क' }
            }
          ];
        case 'hospital':
          return [
            {
              icon: 'hospital',
              title: { en: 'Live Bed & ICU Occupancy', kn: 'ಹಾಸಿಗೆ & ಐಸಿಯು ಲಭ್ಯತೆ', hi: 'लाइव बेड और आईसीयू स्थिति' },
              desc: { en: 'Manage General, Oxygen, and ICU beds with live sync to district emergency command.', kn: 'ಜನರಲ್, ಆಕ್ಸಿಜನ್ ಮತ್ತು ಐಸಿಯು ಹಾಸಿಗೆಗಳನ್ನು ಲೈವ್ ಆಗಿ ನಿರ್ವಹಿಸಿ.', hi: 'जनरल, ऑक्सीजन और आईसीयू बेड का रीयल-टाइम प्रबंधन करें।' },
              tag: { en: 'Real-Time Sync', kn: 'ಲೈವ್ ಸಿಂಕ್', hi: 'रीयल-टाइम सिंक' }
            },
            {
              icon: 'ai',
              title: { en: 'PredictAI Inflow Forecast', kn: 'ಪ್ರೆಡಿಕ್ಟ್ ಎಐ ಒಳಹರಿವು ಅಂದಾಜು', hi: 'PredictAI मरीज़ आमद का पूर्वानुमान' },
              desc: { en: 'Anticipate admission surges and seasonal epidemics 7 days in advance.', kn: 'ಋತುಮಾನದ ಕಾಯಿಲೆಗಳು ಮತ್ತು ರೋಗಿಗಳ ಹೆಚ್ಚಳವನ್ನು 7 ದಿನ ಮುಂಚಿತವಾಗಿ ಅಂದಾಜಿಸಿ.', hi: 'आगामी दिनों में मरीज़ों की आमद का 7 दिन पहले पूर्वानुमान लगाएं।' },
              tag: { en: 'AI Intelligence', kn: 'ಬುದ್ಧಿವಂತ ಎಐ', hi: 'एआई पूर्वानुमान' }
            },
            {
              icon: 'ambulance',
              title: { en: 'Emergency Trauma Desk', kn: 'ತುರ್ತು ಟ್ರಾಮಾ ಡೆಸ್ಕ್', hi: 'आपातकालीन ट्रामा डेस्क' },
              desc: { en: 'Receive instant pre-arrival vitals from inbound 108 ambulances.', kn: 'ಬರುತ್ತಿರುವ 108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗಳಿಂದ ರೋಗಿಯ ಸ್ಥಿತಿಯನ್ನು ಮೊದಲೇ ಪಡೆಯಿರಿ.', hi: 'आने वाली 108 एम्बुलेंस से मरीज़ के वाइटल्स पहले से प्राप्त करें।' },
              tag: { en: 'Pre-Arrival Alert', kn: 'ಆಗಮನ ಪೂರ್ವ ಎಚ್ಚರಿಕೆ', hi: 'पूर्व-आगमन अलर्ट' }
            }
          ];
        case 'ambulance':
          return [
            {
              icon: 'ambulance',
              title: { en: 'Live 108 Emergency Queue', kn: 'ಲೈವ್ 108 ತುರ್ತು ಕ್ಯೂ', hi: 'लाइव 108 आपातकालीन कॉल' },
              desc: { en: 'Instant GPS alerts for critical cardiac, maternal, and trauma emergencies.', kn: 'ಹೃದಯಾಘಾತ ಮತ್ತು ಅಪಘಾತದಂತಹ ತುರ್ತು ಕರೆಗಳಿಗೆ ತಕ್ಷಣದ ಜಿಪಿಎಸ್ ಮಾಹಿತಿ.', hi: 'हृदय, प्रसूति और दुर्घटना मामलों के लिए तत्काल जीपीएस अलर्ट।' },
              tag: { en: 'Instant Dispatch', kn: 'ತಕ್ಷಣದ ರವಾನೆ', hi: 'त्वरित प्रेषण' }
            },
            {
              icon: 'hospital',
              title: { en: 'Nearest Hospital Readiness', kn: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಸನ್ನದ್ಧತೆ', hi: 'निकटतम अस्पताल की तैयारी' },
              desc: { en: 'Check real-time ICU and emergency bed capacity along your route.', kn: 'ನಿಮ್ಮ ಮಾರ್ಗದಲ್ಲಿರುವ ಆಸ್ಪತ್ರೆಗಳ ಐಸಿಯು ಸಾಮರ್ಥ್ಯವನ್ನು ಪರಿಶೀಲಿಸಿ.', hi: 'अपने मार्ग के अस्पतालों में लाइव आईसीयू बेड की उपलब्धता देखें।' },
              tag: { en: 'Route Intelligence', kn: 'ಸ್ಮಾರ್ಟ್ ಮಾರ್ಗ', hi: 'स्मार्ट रूट' }
            },
            {
              icon: 'network',
              title: { en: 'En-Route Telemetry', kn: 'ಮಾರ್ಗಮಧ್ಯೆ ಮಾಹಿತಿ ರವಾನೆ', hi: 'रास्ते में टेलीमेट्री' },
              desc: { en: 'Transmit blood pressure, SpO2, and ECG telemetry to the trauma bay.', kn: 'ರಕ್ತದೊತ್ತಡ, ಆಕ್ಸಿಜನ್ ಮಟ್ಟವನ್ನು ಆಸ್ಪತ್ರೆಗೆ ನೇರವಾಗಿ ರವಾನಿಸಿ.', hi: 'बीपी, ऑक्सीजन और ईसीजी डेटा सीधे अस्पताल को भेजें।' },
              tag: { en: 'Zero Golden-Hour Loss', kn: 'ಗೋಲ್ಡನ್ ಅವರ್ ರಕ್ಷಣೆ', hi: 'गोल्डन ऑवर सुरक्षा' }
            }
          ];
        default: // patient
          return [
            {
              icon: 'hospital',
              title: { en: 'Find Hospitals & Live Beds', kn: 'ಆಸ್ಪತ್ರೆಗಳು & ಲೈವ್ ಹಾಸಿಗೆಗಳು', hi: 'अस्पताल और लाइव बेड खोजें' },
              desc: { en: 'Inspect verified General, ICU, and Oxygen beds with OPD wait times.', kn: 'ಜನರಲ್, ಐಸಿಯು ಮತ್ತು ಆಕ್ಸಿಜನ್ ಹಾಸಿಗೆಗಳ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.', hi: 'सत्यापित जनरल और आईसीयू बेड की रीयल-टाइम उपलब्धता देखें।' },
              tag: { en: 'Verified Live', kn: 'ಪರಿಶೀಲಿಸಿದ ಲೈವ್ ಮಾಹಿತಿ', hi: 'सत्यापित लाइव डेटा' }
            },
            {
              icon: 'capsules',
              title: { en: 'Medicines & Jan Aushadhi', kn: 'ಔಷಧಿಗಳು & ಜನೌಷಧಿ', hi: 'दवाइयां और जन औषधि' },
              desc: { en: 'Search generic medicines at up to 80% discount at nearby Kendras.', kn: 'ಜನೌಷಧಿ ಕೇಂದ್ರಗಳಲ್ಲಿ ಶೇ.80 ರಷ್ಟು ರಿಯಾಯಿತಿಯಲ್ಲಿ ಔಷಧಿಗಳನ್ನು ಪಡೆಯಿರಿ.', hi: 'जन औषधि केंद्रों पर 80% तक कम कीमत में दवाएं खोजें।' },
              tag: { en: 'Affordable Care', kn: 'ಕೈಗೆಟುಕುವ ವೆಚ್ಚ', hi: 'किफ़ायती स्वास्थ्य' }
            },
            {
              icon: 'ambulance',
              title: { en: 'Emergency SOS 108 / 112', kn: 'ತುರ್ತು SOS 108 / 112', hi: 'आपातकालीन SOS 108 / 112' },
              desc: { en: '1-tap priority dispatch with live location tracking and trauma triage.', kn: 'ತುರ್ತು ಸಮಯದಲ್ಲಿ ಆಂಬ್ಯುಲೆನ್ಸ್ ಮತ್ತು ಆಸ್ಪತ್ರೆ ಸಂಪರ್ಕಕ್ಕೆ 1-ಟ್ಯಾಪ್ ಬಟನ್.', hi: '1-टैप में 108 एम्बुलेंस और निकटतम अस्पताल से संपर्क करें।' },
              tag: { en: '24/7 Toll-Free', kn: '24/7 ಉಚಿತ ಸೇವೆ', hi: '24/7 निःशुल्क सेवा' }
            }
          ];
      }
    },

    // 5. Inject Floating 3D Assistant Trigger Button
    injectFloatingAssistant: function() {
      if (document.getElementById('floatingGuideAssistant')) return;

      const trigger = document.createElement('button');
      trigger.id = 'floatingGuideAssistant';
      trigger.className = 'guide-floating-trigger';
      trigger.type = 'button';
      trigger.setAttribute('aria-label', 'Open CareSphere Intelligent User Guide');
      trigger.title = 'Need help on this page? Tap to open CareGuide (or press "?")';

      const iconSvg = (window.CareSphere3D && typeof window.CareSphere3D.svg === 'function')
        ? window.CareSphere3D.svg('assistant', { width: 32, height: 32 })
        : '🤖';

      trigger.innerHTML = `
        <div class="guide-floating-icon" aria-hidden="true">
          ${iconSvg}
          <span class="guide-floating-dot"></span>
        </div>
        <div style="text-align:left">
          <span class="guide-floating-text">CareGuide</span>
          <span class="guide-floating-hint">Tap for help (?)</span>
        </div>
      `;

      trigger.addEventListener('click', () => {
        this.toggleDrawer();
      });

      document.body.appendChild(trigger);
      this.updateVisibility();
    },

    // 6. Inject Slide-over Contextual Guide Drawer
    injectDrawer: function() {
      if (document.getElementById('careGuideDrawer')) return;

      const backdrop = document.createElement('div');
      backdrop.id = 'careGuideBackdrop';
      backdrop.className = 'guide-drawer-backdrop';
      backdrop.addEventListener('click', () => this.closeDrawer());
      document.body.appendChild(backdrop);

      const drawer = document.createElement('aside');
      drawer.id = 'careGuideDrawer';
      drawer.className = 'guide-drawer';
      drawer.setAttribute('aria-label', 'CareSphere Contextual Guide Panel');

      drawer.innerHTML = `
        <div class="guide-drawer-head">
          <div class="guide-drawer-brand">
            <div class="guide-drawer-brand-icon" id="guideDrawerIcon">
              🤖
            </div>
            <div>
              <h3 class="guide-drawer-title" id="guideDrawerTitle">CareSphere Guide</h3>
              <p class="guide-drawer-subtitle" id="guideDrawerSubtitle">Context-aware page assistant</p>
            </div>
          </div>
          <button class="guide-drawer-close" id="guideDrawerCloseBtn" type="button" aria-label="Close Guide">✕</button>
        </div>

        <div class="guide-drawer-body" id="guideDrawerBody">
          <!-- Dynamically populated based on active context -->
        </div>

        <div class="guide-drawer-foot">
          <button class="guide-drawer-help-btn" type="button" id="guideOpenHelpCenterBtn">
            <span>📚</span> <span id="guideHelpCenterBtnText">Open Full Help Center</span>
          </button>
          <div style="display:flex;gap:4px">
            <button type="button" class="splash-lang-chip active" data-drawer-lang="en">EN</button>
            <button type="button" class="splash-lang-chip" data-drawer-lang="kn">ಕನ್ನಡ</button>
            <button type="button" class="splash-lang-chip" data-drawer-lang="hi">हिंदी</button>
          </div>
        </div>
      `;

      document.body.appendChild(drawer);

      document.getElementById('guideDrawerCloseBtn').addEventListener('click', () => this.closeDrawer());

      document.getElementById('guideOpenHelpCenterBtn').addEventListener('click', () => {
        this.closeDrawer();
        this.openHelpCenterInMainApp();
      });

      drawer.querySelectorAll('[data-drawer-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
          const l = btn.dataset.drawerLang;
          this.state.language = l;
          document.querySelectorAll('[data-language]').forEach(s => { s.value = l; });
          window.dispatchEvent(new CustomEvent('caresphere:language', { detail: { language: l } }));
          this.renderDrawerContent();
        });
      });
    },

    // 7. Toggle / Open Drawer with current context
    toggleDrawer: function() {
      if (!this.isMainAppVisible()) return;
      if (this.state.drawerOpen) {
        this.closeDrawer();
      } else {
        this.openDrawer();
      }
    },

    openDrawer: function(contextKey) {
      if (!this.isMainAppVisible()) return;
      this.state.drawerOpen = true;
      const backdrop = document.getElementById('careGuideBackdrop');
      const drawer = document.getElementById('careGuideDrawer');

      if (backdrop) backdrop.classList.add('is-open');
      if (drawer) drawer.classList.add('is-open');

      this.renderDrawerContent(contextKey);
    },

    closeDrawer: function() {
      this.state.drawerOpen = false;
      const backdrop = document.getElementById('careGuideBackdrop');
      const drawer = document.getElementById('careGuideDrawer');

      if (backdrop) backdrop.classList.remove('is-open');
      if (drawer) drawer.classList.remove('is-open');
    },

    // 8. Render Drawer Content based on active context
    renderDrawerContent: function(contextKey) {
      const key = contextKey || this.getCurrentContextKey();
      const meta = this.registry[key] || this.registry.home_patient;
      const lang = this.state.language;

      const titleEl = document.getElementById('guideDrawerTitle');
      const subEl = document.getElementById('guideDrawerSubtitle');
      const iconEl = document.getElementById('guideDrawerIcon');
      const bodyEl = document.getElementById('guideDrawerBody');

      if (titleEl) titleEl.textContent = this.t(meta.title);
      if (subEl) subEl.textContent = `${meta.category} · ${this.state.currentRole.toUpperCase()}`;
      if (iconEl && window.CareSphere3D) {
        iconEl.innerHTML = window.CareSphere3D.svg(meta.icon || 'assistant', { width: 34, height: 34 });
      }

      // Update lang chips active state
      document.querySelectorAll('[data-drawer-lang]').forEach(b => {
        b.classList.toggle('active', b.dataset.drawerLang === lang);
      });

      const startTourText = lang === 'kn' ? 'ಲೈವ್ ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಟೂರ್ ಆರಂಭಿಸಿ' : (lang === 'hi' ? 'लाइव इंटरेक्टिव टूर शुरू करें' : 'Start Interactive Walkthrough');
      const tourPromptText = lang === 'kn' ? 'ಈ ಪುಟದಲ್ಲಿನ ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಹಂತ-ಹಂತವಾಗಿ ಅನ್ವೇಷಿಸಿ.' : (lang === 'hi' ? 'इस पेज की मुख्य सुविधाओं को चरण-दर-चरण सीखें।' : 'Learn while using the actual interface with live element spotlights.');
      const stepsHeading = lang === 'kn' ? 'ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ' : (lang === 'hi' ? 'चरण-दर-चरण निर्देश' : 'Step-by-Step Instructions');
      const faqsHeading = lang === 'kn' ? 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು (FAQ)' : (lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions');
      const tipsHeading = lang === 'kn' ? 'ಉಪಯುಕ್ತ ಸಲಹೆ' : (lang === 'hi' ? 'उपयोगी सुझाव' : 'Helpful Pro-Tip');
      const relatedHeading = lang === 'kn' ? 'ಸಂಬಂಧಿತ ಸೇವೆಗಳು' : (lang === 'hi' ? 'संबंधित सेवाएं' : 'Related Healthcare Services');

      bodyEl.innerHTML = `
        <div class="guide-callout">
          <strong>${lang === 'kn' ? 'ಈ ಪುಟದ ಉದ್ದೇಶ:' : (lang === 'hi' ? 'इस पेज का उद्देश्य:' : 'What is this page?')}</strong>
          ${this.t(meta.desc)}
        </div>

        ${meta.steps && meta.steps.length > 0 ? `
          <div class="guide-walkthrough-cta">
            <div>
              <h4>${startTourText}</h4>
              <p>${tourPromptText}</p>
            </div>
            <button class="guide-start-tour-btn" type="button" id="drawerStartTourBtn">
              <span aria-hidden="true">▶</span> ${lang === 'kn' ? 'ಪ್ರಾರಂಭಿಸಿ' : (lang === 'hi' ? 'शुरू करें' : 'Start')}
            </button>
          </div>
        ` : ''}

        ${meta.steps && meta.steps.length > 0 ? `
          <div>
            <div class="guide-section-label">
              <span>📋</span> ${stepsHeading}
            </div>
            <div class="guide-steps-list">
              ${meta.steps.map((s, idx) => `
                <div class="guide-step-item">
                  <div class="guide-step-number">${idx + 1}</div>
                  <div class="guide-step-text">
                    <strong>${this.t(s.title)}</strong>
                    ${this.t(s.desc)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${meta.faqs && meta.faqs.length > 0 ? `
          <div>
            <div class="guide-section-label">
              <span>❓</span> ${faqsHeading}
            </div>
            <div class="guide-faq-list">
              ${meta.faqs.map(f => `
                <div class="guide-faq-item">
                  <button class="guide-faq-question" type="button">
                    <span>${this.t(f.q)}</span>
                    <span class="guide-faq-arrow" aria-hidden="true">›</span>
                  </button>
                  <div class="guide-faq-answer">
                    ${this.t(f.a)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${meta.tips ? `
          <div class="guide-tip-box">
            <span class="guide-tip-icon">💡</span>
            <div>
              <strong>${tipsHeading}:</strong> ${this.t(meta.tips)}
            </div>
          </div>
        ` : ''}

        ${meta.related && meta.related.length > 0 ? `
          <div>
            <div class="guide-section-label">
              <span>🔗</span> ${relatedHeading}
            </div>
            <div class="guide-related-pills">
              ${meta.related.map(rKey => {
                const rMeta = this.registry[rKey];
                if (!rMeta) return '';
                return `<button class="guide-related-pill" type="button" data-guide-jump="${rKey}">${this.t(rMeta.title)}</button>`;
              }).join('')}
            </div>
          </div>
        ` : ''}
      `;

      // Bind walkthrough CTA
      const tourBtn = document.getElementById('drawerStartTourBtn');
      if (tourBtn) {
        tourBtn.addEventListener('click', () => {
          this.closeDrawer();
          this.startWalkthrough(key);
        });
      }

      // Bind FAQ accordions
      bodyEl.querySelectorAll('.guide-faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.guide-faq-item');
          item.classList.toggle('is-open');
        });
      });

      // Bind Related service jumps
      bodyEl.querySelectorAll('[data-guide-jump]').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetKey = btn.dataset.guideJump;
          this.renderDrawerContent(targetKey);
        });
      });
    },

    // 9. Interactive Walkthrough Engine (Spotlight on actual UI elements)
    startWalkthrough: function(tourKey) {
      const meta = this.registry[tourKey] || this.registry.home_patient;
      if (!meta.steps || meta.steps.length === 0) return;

      this.state.tourActive = true;
      this.state.tourStepIndex = 0;
      this.state.currentTourSteps = meta.steps;

      this.createSpotlightDOM();
      this.showTourStep(0);
    },

    createSpotlightDOM: function() {
      let box = document.getElementById('guideSpotlightBox');
      if (!box) {
        box = document.createElement('div');
        box.id = 'guideSpotlightBox';
        box.className = 'guide-spotlight-box';
        document.body.appendChild(box);
      }

      let card = document.getElementById('guideSpotlightCard');
      if (!card) {
        card = document.createElement('div');
        card.id = 'guideSpotlightCard';
        card.className = 'guide-spotlight-card';
        document.body.appendChild(card);
      }
    },

    showTourStep: function(index) {
      const steps = this.state.currentTourSteps;
      if (index < 0 || index >= steps.length) {
        this.endWalkthrough();
        return;
      }

      this.state.tourStepIndex = index;
      const step = steps[index];
      const lang = this.state.language;

      // Find target element in live DOM
      let targetEl = document.querySelector(step.selector);

      // If not found directly, fall back gracefully to main content or skip
      if (!targetEl) {
        targetEl = document.getElementById('content') || document.body;
      }

      // Scroll element smoothly into view
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Position the spotlight box around element
      const box = document.getElementById('guideSpotlightBox');
      const card = document.getElementById('guideSpotlightCard');

      window.setTimeout(() => {
        const rect = targetEl.getBoundingClientRect();
        const pad = 8;

        box.style.top = `${Math.max(0, rect.top - pad)}px`;
        box.style.left = `${Math.max(0, rect.left - pad)}px`;
        box.style.width = `${Math.min(window.innerWidth - 8, rect.width + pad * 2)}px`;
        box.style.height = `${rect.height + pad * 2}px`;

        // Calculate card position (place below or above target)
        let cardTop = rect.bottom + 16;
        let cardLeft = Math.max(16, Math.min(window.innerWidth - 360, rect.left));

        if (cardTop + 240 > window.innerHeight) {
          cardTop = Math.max(16, rect.top - 220);
        }

        card.style.top = `${cardTop}px`;
        card.style.left = `${cardLeft}px`;

        const isLast = (index === steps.length - 1);
        const nextText = isLast ? (lang === 'kn' ? 'ಮುಗಿಸಿ ✓' : (lang === 'hi' ? 'समाप्त ✓' : 'Finish ✓')) : (lang === 'kn' ? 'ಮುಂದೆ →' : (lang === 'hi' ? 'आगे →' : 'Next →'));
        const prevText = lang === 'kn' ? '← ಹಿಂದೆ' : (lang === 'hi' ? '← पीछे' : '← Previous');
        const skipText = lang === 'kn' ? 'ಟೂರ್ ಬಿಟ್ಟುಬಿಡಿ' : (lang === 'hi' ? 'टूर छोड़ें' : 'Skip Tour');

        card.innerHTML = `
          <div class="guide-spotlight-header">
            <span class="guide-spotlight-step-tag">Step ${index + 1} of ${steps.length}</span>
            <button class="guide-spotlight-close" type="button" id="tourCloseBtn" aria-label="Close Tour">✕</button>
          </div>
          <h4 class="guide-spotlight-title">${this.t(step.title)}</h4>
          <p class="guide-spotlight-body">${this.t(step.desc)}</p>
          <div class="guide-spotlight-actions">
            <div>
              ${index > 0 ? `<button class="guide-spotlight-btn secondary" type="button" id="tourPrevBtn">${prevText}</button>` : ''}
              <button class="guide-spotlight-skip" type="button" id="tourSkipBtn">${skipText}</button>
            </div>
            <button class="guide-spotlight-btn primary" type="button" id="tourNextBtn">${nextText}</button>
          </div>
        `;

        document.getElementById('tourNextBtn').addEventListener('click', () => {
          if (isLast) {
            this.recordTourCompletion();
            this.endWalkthrough();
            this.showFloatingToast(lang === 'kn' ? 'ಅಭಿನಂದನೆಗಳು! ನೀವು ಈ ಟೂರ್ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.' : (lang === 'hi' ? 'बधाई हो! आपने यह टूर सफलतापूर्वक पूरा किया।' : 'Great job! You completed this walkthrough.'));
          } else {
            this.showTourStep(index + 1);
          }
        });

        if (index > 0) {
          document.getElementById('tourPrevBtn').addEventListener('click', () => {
            this.showTourStep(index - 1);
          });
        }

        document.getElementById('tourCloseBtn').addEventListener('click', () => this.endWalkthrough());
        document.getElementById('tourSkipBtn').addEventListener('click', () => this.endWalkthrough());
      }, 250);
    },

    endWalkthrough: function() {
      this.state.tourActive = false;
      const box = document.getElementById('guideSpotlightBox');
      const card = document.getElementById('guideSpotlightCard');
      if (box) box.remove();
      if (card) card.remove();
    },

    recordTourCompletion: function() {
      const tourId = this.getCurrentContextKey();
      if (!this.state.progress.completed.includes(tourId)) {
        this.state.progress.completed.push(tourId);
        try {
          localStorage.setItem('caresphere-guide-progress', JSON.stringify(this.state.progress));
        } catch (e) {}
      }
    },

    // 10. Identify Current Application Context
    getCurrentContextKey: function() {
      const role = this.state.currentRole;
      const page = this.state.currentPage;

      if (role !== 'patient') {
        const roleKey = `${role}_dashboard`;
        if (this.registry[roleKey]) return roleKey;
      }

      if (page === 'medicines') return 'medicines';
      if (page === 'blood') return 'blood';
      if (page === 'beds' || page === 'hospitals') return 'beds';
      if (page === 'appointments') return 'appointments';
      if (page === 'sos') return 'sos';

      return 'home_patient';
    },

    updateContext: function(page, role) {
      if (page) this.state.currentPage = page;
      if (role) this.state.currentRole = role;

      // Update floating trigger label
      const hint = document.querySelector('.guide-floating-hint');
      if (hint) {
        const ctxMeta = this.registry[this.getCurrentContextKey()];
        if (ctxMeta) {
          hint.textContent = `${this.t(ctxMeta.title).split(' ')[0]} Guide (?)`;
        }
      }

      if (this.state.drawerOpen) {
        this.renderDrawerContent();
      }
    },

    updateLanguage: function(lang) {
      this.state.language = lang;
      if (this.state.drawerOpen) {
        this.renderDrawerContent();
      }
      if (this.state.tourActive) {
        this.showTourStep(this.state.tourStepIndex);
      }
    },

    // 11. Render Full Help Center into #content (called when Help/User Guide tab is chosen)
    openHelpCenterInMainApp: function() {
      const contentEl = document.getElementById('content');
      if (!contentEl) return;

      const lang = this.state.language;
      const completedCount = this.state.progress.completed.length;
      const totalCount = Object.keys(this.registry).length;

      const assistantSvg = (window.CareSphere3D && typeof window.CareSphere3D.svg === 'function')
        ? window.CareSphere3D.svg('assistant', { width: 80, height: 80 })
        : '🤖';

      contentEl.innerHTML = `
        <div class="guide-help-center-shell">
          <div class="guide-hc-hero">
            <div style="flex:1">
              <h2>${lang === 'kn' ? 'ಆರೋಗ್ಯ ಸೇವೆಯನ್ನು ಸುಲಭಗೊಳಿಸೋಣ.' : (lang === 'hi' ? 'स्वास्थ्य सेवा को आसान बनाएं।' : "Let's make healthcare easier.")}</h2>
              <p>${lang === 'kn' ? 'ಕೇರ್‌ಸ್ಪಿಯರ್‌ನ ಎಲ್ಲಾ ವೈಶಿಷ್ಟ್ಯಗಳನ್ನು ಸುಲಭ ಗೈಡ್‌ಗಳು, ಲೈವ್ ಡೆಮೊ ಮತ್ತು ಸಲಹೆಗಳ ಮೂಲಕ ಕಲಿಯಿರಿ.' : (lang === 'hi' ? 'सरल गाइड, लाइव प्रदर्शन और उपयोगी सुझावों के साथ केयरस्फीयर का उपयोग करना सीखें।' : 'Learn how to use CareSphere with simple guides, interactive demonstrations, and helpful tips.')}</p>
              <div class="guide-hc-search">
                <span class="guide-hc-search-icon">🔍</span>
                <input type="search" id="hcSearchInput" placeholder="${lang === 'kn' ? 'ಆಸ್ಪತ್ರೆ, ಔಷಧಿ, ರಕ್ತ, ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಗೈಡ್ ಹುಡುಕಿ...' : (lang === 'hi' ? 'अस्पताल, दवा, ब्लड बैंक, अपॉइंटमेंट गाइड खोजें...' : 'Search for hospital, medicine, blood, appointment guides...')}">
              </div>
            </div>
            <div style="flex:0 0 100px;display:grid;place-items:center" aria-hidden="true">
              ${assistantSvg}
            </div>
          </div>

          <div class="guide-progress-card">
            <div class="guide-progress-info">
              <span>🏆</span>
              <span>${lang === 'kn' ? `ಕಲಿಕೆಯ ಪ್ರಗತಿ: <strong>${completedCount} / ${totalCount}</strong> ಟೂರ್ ಪೂರ್ಣಗೊಂಡಿದೆ` : (lang === 'hi' ? `सीखने की प्रगति: <strong>${completedCount} / ${totalCount}</strong> टूर पूरे हुए` : `Learning Progress: <strong>${completedCount} of ${totalCount}</strong> walkthroughs completed`)}</span>
            </div>
            <div class="guide-progress-bar-wrap">
              <div class="guide-progress-bar-fill" style="width: ${Math.max(10, Math.round((completedCount / totalCount) * 100))}%"></div>
            </div>
          </div>

          <div>
            <h3 style="font-family:var(--font-display);font-size:18px;font-weight:800;color:#101B35;margin:0 0 16px">
              ${lang === 'kn' ? 'ಎಲ್ಲಾ ಗೈಡ್ ವಿಭಾಗಗಳು' : (lang === 'hi' ? 'सभी गाइड श्रेणियां' : 'Browse All Guide Categories')}
            </h3>
            <div class="guide-categories-grid" id="hcCategoriesGrid">
              ${Object.values(this.registry).map(g => `
                <div class="guide-category-card" data-guide-open="${g.id}">
                  <div class="guide-category-icon">
                    ${(window.CareSphere3D && typeof window.CareSphere3D.svg === 'function') ? window.CareSphere3D.svg(g.icon, { width: 38, height: 38 }) : '✚'}
                  </div>
                  <h3>${this.t(g.title)}</h3>
                  <p>${this.t(g.desc)}</p>
                  <span class="guide-category-count">
                    <span>${lang === 'kn' ? 'ಗೈಡ್ ತೆರೆಯಿರಿ' : (lang === 'hi' ? 'गाइड खोलें' : 'Open Guide')}</span> →
                  </span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      // Bind category card clicks
      contentEl.querySelectorAll('[data-guide-open]').forEach(card => {
        card.addEventListener('click', () => {
          const gId = card.dataset.guideOpen;
          this.openDrawer(gId);
        });
      });

      // Bind search filter
      const searchInput = document.getElementById('hcSearchInput');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const q = e.target.value.toLowerCase().trim();
          contentEl.querySelectorAll('.guide-category-card').forEach(c => {
            const text = c.textContent.toLowerCase();
            c.style.display = text.includes(q) ? 'flex' : 'none';
          });
        });
      }
    },

    // 12. Floating Toast Notification
    showFloatingToast: function(message) {
      let toast = document.getElementById('guideFloatingToast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'guideFloatingToast';
        toast.style.cssText = `
          position: fixed;
          bottom: 84px;
          right: 24px;
          z-index: 860;
          padding: 12px 18px;
          border-radius: 12px;
          background: #101B35;
          color: #FFFFFF;
          border: 1px solid rgba(52, 120, 246, 0.4);
          box-shadow: 0 10px 28px rgba(16, 27, 53, 0.3);
          font-size: 12.5px;
          font-weight: 650;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: guide-scale-up 0.3s ease both;
        `;
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<span>🤖</span> <span>${message}</span>`;
      toast.style.display = 'flex';

      window.clearTimeout(this._toastTimer);
      this._toastTimer = window.setTimeout(() => {
        if (toast) toast.style.display = 'none';
      }, 4200);
    }
  };

  window.CareSphereGuide = CareSphereGuide;
})(typeof window !== 'undefined' ? window : this);

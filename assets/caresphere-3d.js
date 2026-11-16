/**
 * CareSphere 3D & Advanced Visual System
 * Bespoke 3D Graphics, High-DPI Holographic Canvas Engine, and Dimensional Vector Models
 * Crafted for award-winning digital healthcare experiences.
 */
(function(window) {
  'use strict';

  const CareSphere3D = {
    /**
     * Render high-fidelity 3D vector illustrations
     * @param {string} name - 3D element identifier
     * @param {object} opts - { width, height, className }
     */
    svg: function(name, opts) {
      opts = opts || {};
      const w = opts.width || 48;
      const h = opts.height || 48;
      const cls = opts.className ? ' ' + opts.className : '';

      switch(name) {
        // 1. Floating 3D Medical Cross
        case 'cross':
          return `<svg class="cs-3d cs-3d-cross${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <defs>
              <linearGradient id="cs-cross-front" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3B82F6"/>
                <stop offset="60%" stop-color="#2563EB"/>
                <stop offset="100%" stop-color="#1D4ED8"/>
              </linearGradient>
              <linearGradient id="cs-cross-top" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#93C5FD"/>
                <stop offset="100%" stop-color="#3B82F6"/>
              </linearGradient>
              <linearGradient id="cs-cross-side" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1E40AF"/>
                <stop offset="100%" stop-color="#0F172A"/>
              </linearGradient>
              <linearGradient id="cs-cross-core" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#2DD4BF"/>
                <stop offset="100%" stop-color="#0D9488"/>
              </linearGradient>
              <filter id="cs-cross-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#1E3A8A" flood-opacity="0.25"/>
              </filter>
            </defs>
            <ellipse cx="60" cy="108" rx="34" ry="8" fill="rgba(16,27,53,0.12)"/>
            <!-- 3D Beveled Cross Geometry -->
            <g filter="url(#cs-cross-shadow)">
              <path d="M42 28 L50 18 L78 18 L70 28 Z" fill="url(#cs-cross-top)"/>
              <path d="M70 28 L78 18 L78 40 L70 50 Z" fill="url(#cs-cross-side)"/>
              <path d="M70 50 L78 40 L100 40 L92 50 Z" fill="url(#cs-cross-top)"/>
              <path d="M92 50 L100 40 L100 68 L92 78 Z" fill="url(#cs-cross-side)"/>
              <path d="M92 78 L100 68 L78 68 L70 78 Z" fill="url(#cs-cross-side)"/>
              <path d="M70 78 L78 68 L78 98 L70 108 Z" fill="url(#cs-cross-side)"/>
              <path d="M70 108 L78 98 L50 98 L42 108 Z" fill="url(#cs-cross-side)"/>
              <path d="M42 108 L50 98 L50 68 L42 78 Z" fill="url(#cs-cross-side)"/>
              <path d="M42 78 L50 68 L28 68 L20 78 Z" fill="url(#cs-cross-side)"/>
              <path d="M20 78 L28 68 L28 40 L20 50 Z" fill="url(#cs-cross-side)"/>
              <path d="M20 50 L28 40 L50 40 L42 28 Z" fill="url(#cs-cross-top)"/>
              <!-- Front Face -->
              <path d="M44 28 h26 v22 h22 v28 h-22 v30 h-26 v-30 h-24 v-28 h24 Z" fill="url(#cs-cross-front)"/>
            </g>
            <!-- Core Illuminated Quantum Node -->
            <circle cx="57" cy="63" r="10" fill="url(#cs-cross-core)"/>
            <circle cx="54" cy="60" r="3.5" fill="#FFFFFF" opacity="0.85"/>
            <!-- Highlights -->
            <path d="M46 30 h22" stroke="#BFDBFE" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
            <path d="M22 52 h20" stroke="#BFDBFE" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
          </svg>`;

        // 2. 3D Healthcare Shield
        case 'shield':
          return `<svg class="cs-3d cs-3d-shield${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <defs>
              <linearGradient id="cs-shield-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1E3A8A"/>
                <stop offset="50%" stop-color="#2563EB"/>
                <stop offset="100%" stop-color="#0284C7"/>
              </linearGradient>
              <linearGradient id="cs-shield-rim" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#93C5FD"/>
                <stop offset="50%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#38BDF8"/>
              </linearGradient>
              <linearGradient id="cs-shield-glare" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.45"/>
                <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="110" rx="32" ry="8" fill="rgba(16,27,53,0.12)"/>
            <!-- Outer Metal Bevel -->
            <path d="M60 14 L96 28 C96 68 81 92 60 106 C39 92 24 68 24 28 Z" fill="none" stroke="url(#cs-shield-rim)" stroke-width="4"/>
            <!-- Body -->
            <path d="M60 18 L92 31 C92 65 78 88 60 100 C42 88 28 65 28 31 Z" fill="url(#cs-shield-bg)"/>
            <!-- Glare Mask -->
            <path d="M60 18 L92 31 C92 65 78 88 60 100 Z" fill="url(#cs-shield-glare)"/>
            <!-- Embossed White Cross -->
            <path d="M55 36 h10 v14 h14 v10 h-14 v16 h-10 v-16 h-14 v-10 h14 Z" fill="#FFFFFF" opacity="0.95"/>
            <path d="M56 37 h8 v13 h13 v8 h-13 v15 h-8 v-15 h-13 v-8 h13 Z" fill="#14B8A6"/>
            <circle cx="60" cy="46" r="3" fill="#FFFFFF"/>
          </svg>`;

        // 3. Medical Heart Illustration
        case 'heart':
          return `<svg class="cs-3d cs-3d-heart${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <defs>
              <linearGradient id="cs-heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F43F5E"/>
                <stop offset="50%" stop-color="#E11D48"/>
                <stop offset="100%" stop-color="#881337"/>
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="108" rx="28" ry="7" fill="rgba(16,27,53,0.12)"/>
            <!-- Depth shadow layer -->
            <path d="M60 94 L53 87 C31 66 18 53 18 36 A20 20 0 0 1 54 23 L60 30 L66 23 A20 20 0 0 1 102 36 C102 53 89 66 67 87 Z" fill="#4C0519" transform="translate(3, 4)"/>
            <!-- Main Heart -->
            <path d="M60 94 L53 87 C31 66 18 53 18 36 A20 20 0 0 1 54 23 L60 30 L66 23 A20 20 0 0 1 102 36 C102 53 89 66 67 87 Z" fill="url(#cs-heart-grad)"/>
            <!-- Specular Highlight -->
            <path d="M30 32 A12 12 0 0 1 50 26" stroke="#FFE4E6" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.85"/>
            <!-- Holographic ECG Line -->
            <path d="M24 56 H40 L46 42 L52 68 L58 48 L64 62 L70 56 H96" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="52" cy="68" r="3.2" fill="#38BDF8"/>
          </svg>`;

        // 4. Floating Medical Capsules / Pills
        case 'capsules':
          return `<svg class="cs-3d cs-3d-capsules${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <defs>
              <linearGradient id="cs-pill-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#60A5FA"/>
                <stop offset="100%" stop-color="#2563EB"/>
              </linearGradient>
              <linearGradient id="cs-pill-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#5EEAD4"/>
                <stop offset="100%" stop-color="#0D9488"/>
              </linearGradient>
              <linearGradient id="cs-pill-white" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFFFFF"/>
                <stop offset="100%" stop-color="#E2E8F0"/>
              </linearGradient>
            </defs>
            <ellipse cx="64" cy="106" rx="35" ry="9" fill="rgba(16,27,53,0.12)"/>
            <!-- Primary Capsule (Blue/White, angled -32deg) -->
            <g transform="translate(62, 54) rotate(-32) translate(-36, -16)">
              <rect x="0" y="0" width="36" height="32" rx="16" fill="url(#cs-pill-blue)"/>
              <rect x="36" y="0" width="36" height="32" rx="16" fill="url(#cs-pill-white)"/>
              <line x1="36" y1="0" x2="36" y2="32" stroke="rgba(16,27,53,0.12)" stroke-width="1.5"/>
              <path d="M12 6 h48" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
            </g>
            <!-- Secondary Capsule (Teal/White, angled 42deg) -->
            <g transform="translate(38, 76) rotate(42) translate(-26, -12)">
              <rect x="0" y="0" width="26" height="24" rx="12" fill="url(#cs-pill-teal)"/>
              <rect x="26" y="0" width="26" height="24" rx="12" fill="url(#cs-pill-white)"/>
              <path d="M8 4 h36" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
            </g>
          </svg>`;

        // 5. 3D Hospital Building
        case 'hospital':
          return `<svg class="cs-3d cs-3d-hospital${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <defs>
              <linearGradient id="cs-bldg-left" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#3B82F6"/>
                <stop offset="100%" stop-color="#1E3A8A"/>
              </linearGradient>
              <linearGradient id="cs-bldg-right" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#60A5FA"/>
                <stop offset="100%" stop-color="#2563EB"/>
              </linearGradient>
              <linearGradient id="cs-bldg-top" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#93C5FD"/>
                <stop offset="100%" stop-color="#60A5FA"/>
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="108" rx="42" ry="10" fill="rgba(16,27,53,0.14)"/>
            <!-- Roof Top -->
            <polygon points="60,34 98,54 60,74 22,54" fill="url(#cs-bldg-top)"/>
            <!-- Left Wall -->
            <polygon points="22,54 60,74 60,104 22,84" fill="url(#cs-bldg-left)"/>
            <!-- Right Wall -->
            <polygon points="60,74 98,54 98,84 60,104" fill="url(#cs-bldg-right)"/>
            <!-- Helipad -->
            <ellipse cx="60" cy="54" rx="18" ry="9" fill="#1E293B"/>
            <ellipse cx="60" cy="54" rx="14" ry="7" fill="none" stroke="#F8FAFC" stroke-width="1.5"/>
            <text x="60" y="58" text-anchor="middle" font-size="10" font-weight="900" fill="#EF4444" font-family="sans-serif">H</text>
            <!-- Windows -->
            <polygon points="30,62 38,66 38,72 30,68" fill="#BAE6FD" opacity="0.9"/>
            <polygon points="44,69 52,73 52,79 44,75" fill="#BAE6FD" opacity="0.9"/>
            <polygon points="30,74 38,78 38,84 30,80" fill="#BAE6FD" opacity="0.9"/>
            <polygon points="68,73 76,69 76,75 68,79" fill="#FDE047" opacity="0.95"/>
            <polygon points="82,66 90,62 90,68 82,72" fill="#FDE047" opacity="0.95"/>
            <!-- Entrance Cross -->
            <polygon points="56,86 64,82 64,96 56,100" fill="#EF4444"/>
            <polygon points="50,91 70,81 70,86 50,96" fill="#EF4444"/>
          </svg>`;

        // 6. Ambulance Illustration
        case 'ambulance':
          return `<svg class="cs-3d cs-3d-ambulance${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <defs>
              <linearGradient id="cs-amb-stripe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#EF4444"/>
                <stop offset="100%" stop-color="#DC2626"/>
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="98" rx="44" ry="10" fill="rgba(16,27,53,0.15)"/>
            <polygon points="18,60 52,42 96,62 62,82" fill="#F8FAFC"/>
            <polygon points="18,60 62,82 62,92 18,72" fill="#CBD5E1"/>
            <polygon points="62,82 96,62 96,72 62,92" fill="#94A3B8"/>
            <!-- Front Windshield -->
            <polygon points="68,58 92,69 92,76 68,66" fill="#0284C7"/>
            <!-- Emergency Siren -->
            <ellipse cx="44" cy="42" rx="6" ry="3" fill="#EF4444"/>
            <circle cx="44" cy="40" r="3" fill="#F87171"/>
            <!-- Stripe & Cross -->
            <polygon points="26,67 56,53 56,58 26,72" fill="url(#cs-amb-stripe)"/>
            <polygon points="36,65 42,62 42,72 36,75" fill="#EF4444"/>
            <polygon points="33,69 45,64 45,67 33,72" fill="#EF4444"/>
            <!-- Wheels -->
            <ellipse cx="34" cy="78" rx="7" ry="9" fill="#1E293B"/>
            <ellipse cx="78" cy="88" rx="7" ry="9" fill="#1E293B"/>
          </svg>`;

        // 7. 3D Blood Drop
        case 'blood':
          return `<svg class="cs-3d cs-3d-blood${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <defs>
              <linearGradient id="cs-blood-crystal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F43F5E"/>
                <stop offset="40%" stop-color="#E11D48"/>
                <stop offset="85%" stop-color="#9F1239"/>
                <stop offset="100%" stop-color="#4C0519"/>
              </linearGradient>
            </defs>
            <ellipse cx="60" cy="108" rx="26" ry="7" fill="rgba(16,27,53,0.14)"/>
            <path d="M60 16 C60 16 28 58 28 80 A32 32 0 0 0 92 80 C92 58 60 16 60 16 Z" fill="#881337" transform="translate(2, 3)"/>
            <path d="M60 16 C60 16 28 58 28 80 A32 32 0 0 0 92 80 C92 58 60 16 60 16 Z" fill="url(#cs-blood-crystal)"/>
            <!-- Specular Arc -->
            <path d="M42 54 C36 64 36 76 42 86 C40 76 42 64 48 56 Z" fill="#FFFFFF" opacity="0.6"/>
            <ellipse cx="66" cy="38" rx="3" ry="7" transform="rotate(30 66 38)" fill="#FFFFFF" opacity="0.7"/>
            <path d="M57 78 h10 M62 73 v10" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
          </svg>`;

        // 8. Medical Equipment (Stethoscope & Pulse)
        case 'equipment':
          return `<svg class="cs-3d cs-3d-equipment${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <ellipse cx="60" cy="108" rx="34" ry="8" fill="rgba(16,27,53,0.12)"/>
            <path d="M38 22 C38 48 48 64 60 64 C72 64 82 48 82 22" fill="none" stroke="#94A3B8" stroke-width="6" stroke-linecap="round"/>
            <path d="M60 64 C60 84 84 86 84 94 C84 100 76 102 68 102 C56 102 48 94 48 88" fill="none" stroke="#0284C7" stroke-width="7" stroke-linecap="round"/>
            <ellipse cx="48" cy="88" rx="14" ry="11" fill="#94A3B8"/>
            <ellipse cx="48" cy="88" rx="10" ry="7" fill="#0EA5E9"/>
            <ellipse cx="46" cy="86" rx="4" ry="2.5" fill="#FFFFFF" opacity="0.85"/>
            <!-- Holographic Pulse -->
            <path d="M14 54 H32 L38 42 L44 66 L50 48 L56 58 L62 54 H106" fill="none" stroke="#10B981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>`;

        // 9. Healthcare Network Visualization
        case 'network':
          return `<svg class="cs-3d cs-3d-network${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <ellipse cx="60" cy="110" rx="38" ry="8" fill="rgba(16,27,53,0.12)"/>
            <line x1="60" y1="56" x2="28" y2="34" stroke="#93C5FD" stroke-width="2.5" stroke-dasharray="3 3"/>
            <line x1="60" y1="56" x2="92" y2="34" stroke="#93C5FD" stroke-width="2.5" stroke-dasharray="3 3"/>
            <line x1="60" y1="56" x2="22" y2="82" stroke="#5EEAD4" stroke-width="2.5"/>
            <line x1="60" y1="56" x2="98" y2="82" stroke="#C084FC" stroke-width="2.5"/>
            <line x1="60" y1="56" x2="60" y2="98" stroke="#93C5FD" stroke-width="2.5"/>
            <circle cx="60" cy="56" r="16" fill="#2563EB"/>
            <circle cx="56" cy="51" r="5" fill="#FFFFFF" opacity="0.6"/>
            <path d="M54 56 h12 M60 50 v12" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="28" cy="34" r="10" fill="#0D9488"/>
            <circle cx="92" cy="34" r="10" fill="#7E22CE"/>
            <circle cx="22" cy="82" r="9" fill="#1D4ED8"/>
            <circle cx="98" cy="82" r="9" fill="#0F766E"/>
            <circle cx="60" cy="98" r="8" fill="#7955D9"/>
          </svg>`;

        // 11. Floating 3D Healthcare Guide Assistant
        case 'assistant':
        case 'guide':
          return `<svg class="cs-3d cs-3d-assistant${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <defs>
              <linearGradient id="cs-ast-body" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#3478F6"/>
                <stop offset="60%" stop-color="#1E3A8A"/>
                <stop offset="100%" stop-color="#101B35"/>
              </linearGradient>
              <linearGradient id="cs-ast-head" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#EFF6FF"/>
                <stop offset="50%" stop-color="#DBEAFE"/>
                <stop offset="100%" stop-color="#93C5FD"/>
              </linearGradient>
              <linearGradient id="cs-ast-visor" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0F172A"/>
                <stop offset="100%" stop-color="#1E293B"/>
              </linearGradient>
              <linearGradient id="cs-ast-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#2DD4BF"/>
                <stop offset="100%" stop-color="#0D9488"/>
              </linearGradient>
              <filter id="cs-ast-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#1E3A8A" flood-opacity="0.28"/>
              </filter>
            </defs>
            <ellipse cx="60" cy="112" rx="36" ry="8" fill="rgba(16,27,53,0.14)"/>
            <g filter="url(#cs-ast-glow)">
              <rect x="36" y="66" width="48" height="36" rx="18" fill="url(#cs-ast-body)"/>
              <path d="M60 74 L68 78 v6 c0 6 -4 10 -8 12 c-4 -2 -8 -6 -8 -12 v-6 Z" fill="#FFFFFF"/>
              <path d="M58 80 h4 v3 h3 v3 h-3 v3 h-4 v-3 h-3 v-3 h3 Z" fill="url(#cs-ast-teal)"/>
              <circle cx="24" cy="78" r="9" fill="url(#cs-ast-body)"/>
              <circle cx="96" cy="74" r="9" fill="url(#cs-ast-body)"/>
              <circle cx="24" cy="78" r="4" fill="#38BDF8"/>
              <circle cx="96" cy="74" r="4" fill="#2DD4BF"/>
              <ellipse cx="60" cy="64" rx="16" ry="5" fill="#64748B"/>
              <circle cx="60" cy="40" r="26" fill="url(#cs-ast-head)"/>
              <rect x="42" y="28" width="36" height="22" rx="10" fill="url(#cs-ast-visor)"/>
              <ellipse cx="51" cy="39" rx="4.5" ry="5" fill="#2DD4BF"/>
              <ellipse cx="69" cy="39" rx="4.5" ry="5" fill="#2DD4BF"/>
              <circle cx="52" cy="37" r="1.5" fill="#FFFFFF"/>
              <circle cx="70" cy="37" r="1.5" fill="#FFFFFF"/>
              <path d="M57 44 Q60 46 63 44" stroke="#2DD4BF" stroke-width="1.8" stroke-linecap="round" fill="none"/>
              <rect x="58" y="10" width="4" height="6" rx="2" fill="#94A3B8"/>
              <circle cx="60" cy="8" r="5" fill="#10B981"/>
              <circle cx="60" cy="8" r="8" fill="none" stroke="#10B981" stroke-width="1.2" opacity="0.6"/>
            </g>
          </svg>`;

        // 10. AI-Powered Healthcare Intelligence
        case 'ai':
        default:
          return `<svg class="cs-3d cs-3d-ai${cls}" viewBox="0 0 120 120" width="${w}" height="${h}" aria-hidden="true">
            <ellipse cx="60" cy="110" rx="36" ry="8" fill="rgba(16,27,53,0.14)"/>
            <ellipse cx="60" cy="56" rx="42" ry="18" fill="none" stroke="#38BDF8" stroke-width="2.5" transform="rotate(-28 60 56)"/>
            <ellipse cx="60" cy="56" rx="42" ry="18" fill="none" stroke="#A855F7" stroke-width="2.5" transform="rotate(40 60 56)"/>
            <circle cx="60" cy="56" r="20" fill="#6366F1"/>
            <circle cx="54" cy="50" r="7" fill="#FFFFFF" opacity="0.75"/>
            <polygon points="60,44 64,52 72,56 64,60 60,68 56,60 48,56 56,52" fill="#FFFFFF"/>
            <circle cx="28" cy="42" r="3.5" fill="#2DD4BF"/>
            <circle cx="92" cy="70" r="3.5" fill="#38BDF8"/>
          </svg>`;
      }
    },

    /**
     * Initializes a bespoke 3D interactive holographic healthcare globe on canvas
     * Features high-DPI scaling, geodesic latitude/longitude wireframe, rotating 3D nodes,
     * mouse-responsive spring parallax, and depth rendering.
     */
    initHeroCanvas: function(canvas) {
      if (typeof canvas === 'string') {
        canvas = document.getElementById(canvas);
      }
      if (!canvas) return null;
      if (typeof canvas._csDestroy === 'function') {
        canvas._csDestroy();
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Handle High DPI displays
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let cssW = canvas.clientWidth || 360;
      let cssH = canvas.clientHeight || 280;

      function resize() {
        if (!canvas.parentElement) return;
        const rect = canvas.getBoundingClientRect();
        cssW = Math.min(rect.width || 360, 480);
        cssH = Math.min(rect.height || 280, 360);
        canvas.width = cssW * dpr;
        canvas.height = cssH * dpr;
        ctx.scale(dpr, dpr);
      }
      resize();
      window.addEventListener('resize', resize);

      let animId = null;
      let angleY = 0;
      let angleX = 0.2;
      let targetRotX = 0.2;
      let targetRotY = 0;
      let mouseX = 0, mouseY = 0;
      let isVisible = true;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Track mouse over canvas or parent container
      function onMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width - 0.5;
        const my = (e.clientY - rect.top) / rect.height - 0.5;
        targetRotY = mx * 0.9;
        targetRotX = 0.2 + my * 0.5;
      }
      window.addEventListener('mousemove', onMouseMove);

      // Intersection Observer to prevent running when scrolled off
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          isVisible = entries[0].isIntersecting;
          if (isVisible && !animId) loop();
        }, { threshold: 0.1 });
        observer.observe(canvas);
      }

      // 6 Key Connected Healthcare Nodes in 3D polar coordinates
      const nodes = [
        { label: 'Hospital', lat: 0.35, lon: 0.0, r: 88, color: '#3478F6', icon: 'H' },
        { label: 'Doctor', lat: -0.25, lon: 1.1, r: 88, color: '#19B8B0', icon: 'Dr' },
        { label: 'Emergency', lat: 0.55, lon: 2.3, r: 88, color: '#EF4444', icon: '🚨' },
        { label: 'Pharmacy', lat: -0.45, lon: 3.5, r: 88, color: '#8B5CF6', icon: 'Rx' },
        { label: 'Blood Bank', lat: 0.15, lon: 4.6, r: 88, color: '#F43F5E', icon: '🩸' },
        { label: 'Citizen', lat: -0.65, lon: 5.4, r: 88, color: '#38BDF8', icon: 'P' }
      ];

      // Geodesic Wireframe Rings (Latitudes and Longitudes)
      const latRings = [-0.6, -0.3, 0.0, 0.3, 0.6];
      const lonRings = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
      const sphereRadius = 82;

      function loop() {
        if (!isVisible) {
          animId = null;
          return;
        }

        ctx.clearRect(0, 0, cssW, cssH);

        // Smooth rotation damping
        if (!prefersReduced) {
          angleY += 0.009;
        }
        angleX += (targetRotX - angleX) * 0.05;
        const curAngleY = angleY + targetRotY;

        const cx = cssW / 2;
        const cy = cssH / 2;

        // Ambient radial background illumination
        const ambient = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
        ambient.addColorStop(0, 'rgba(52, 120, 246, 0.2)');
        ambient.addColorStop(0.5, 'rgba(25, 184, 176, 0.1)');
        ambient.addColorStop(1, 'rgba(10, 20, 40, 0)');
        ctx.fillStyle = ambient;
        ctx.beginPath();
        ctx.arc(cx, cy, 130, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(cx, cy);

        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(curAngleY);
        const sinY = Math.sin(curAngleY);

        // 3D Point Projection Helper
        function project(x, y, z) {
          // Rotate around Y
          const x1 = x * cosY - z * sinY;
          const z1 = z * cosY + x * sinY;
          // Rotate around X
          const y1 = y * cosX - z1 * sinX;
          const z2 = z1 * cosX + y * sinX;

          const fov = 260;
          const scale = fov / (fov + z2);
          return { px: x1 * scale, py: y1 * scale, z: z2, scale };
        }

        // Draw Back Latitude Wireframe Rings (z < 0)
        latRings.forEach(lat => {
          const r = sphereRadius * Math.cos(lat);
          const y = sphereRadius * Math.sin(lat);
          ctx.beginPath();
          let started = false;
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.2) {
            const pt = project(r * Math.cos(a), y, r * Math.sin(a));
            if (pt.z < 0) {
              if (!started) { ctx.moveTo(pt.px, pt.py); started = true; }
              else ctx.lineTo(pt.px, pt.py);
            } else {
              started = false;
            }
          }
          ctx.strokeStyle = 'rgba(52, 120, 246, 0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
        });

        // Central Illuminated Core
        const coreGrad = ctx.createRadialGradient(-10, -10, 4, 0, 0, 44);
        coreGrad.addColorStop(0, '#FFFFFF');
        coreGrad.addColorStop(0.2, '#60A5FA');
        coreGrad.addColorStop(0.7, '#1E40AF');
        coreGrad.addColorStop(1, '#0B132B');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, 38, 0, Math.PI * 2);
        ctx.fill();

        // Cross Emblem in Core
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-4, -14, 8, 28);
        ctx.fillRect(-14, -4, 28, 8);

        // Draw Front Latitude Wireframe Rings (z >= 0)
        latRings.forEach(lat => {
          const r = sphereRadius * Math.cos(lat);
          const y = sphereRadius * Math.sin(lat);
          ctx.beginPath();
          let started = false;
          for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.2) {
            const pt = project(r * Math.cos(a), y, r * Math.sin(a));
            if (pt.z >= 0) {
              if (!started) { ctx.moveTo(pt.px, pt.py); started = true; }
              else ctx.lineTo(pt.px, pt.py);
            } else {
              started = false;
            }
          }
          ctx.strokeStyle = 'rgba(25, 184, 176, 0.32)';
          ctx.lineWidth = 1.3;
          ctx.stroke();
        });

        // Calculate 3D projected nodes
        const projectedNodes = nodes.map(node => {
          const x = node.r * Math.cos(node.lat) * Math.sin(node.lon);
          const y = node.r * Math.sin(node.lat);
          const z = node.r * Math.cos(node.lat) * Math.cos(node.lon);
          const pt = project(x, y, z);
          return { ...node, ...pt };
        });

        // Draw Connecting Arc Rays between adjacent nodes
        ctx.lineWidth = 1.5;
        for (let i = 0; i < projectedNodes.length; i++) {
          const a = projectedNodes[i];
          const b = projectedNodes[(i + 1) % projectedNodes.length];
          const alpha = Math.max(0.1, (a.z + b.z + 160) / 320);
          ctx.strokeStyle = `rgba(52, 120, 246, ${alpha * 0.45})`;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          // Curved arc towards center
          const mx = (a.px + b.px) / 2 * 0.75;
          const my = (a.py + b.py) / 2 * 0.75;
          ctx.quadraticCurveTo(mx, my, b.px, b.py);
          ctx.stroke();
        }

        // Sort nodes by Z for proper depth
        projectedNodes.sort((a, b) => a.z - b.z);

        // Draw Nodes
        projectedNodes.forEach(node => {
          const rad = Math.max(4, 9 * node.scale);
          const alpha = Math.max(0.2, (node.z + 100) / 200);

          // Node Halo
          ctx.beginPath();
          ctx.arc(node.px, node.py, rad * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = node.color.replace(')', `, ${alpha * 0.25})`).replace('rgb', 'rgba').replace('#', 'rgba(');
          // fallback halo
          ctx.fillStyle = `${node.color}33`;
          ctx.fill();

          // Main Sphere
          ctx.beginPath();
          ctx.arc(node.px, node.py, rad, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.fill();

          // Specular Hotspot
          ctx.beginPath();
          ctx.arc(node.px - rad * 0.3, node.py - rad * 0.3, rad * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          // Node Label (when on front hemisphere)
          if (node.z > -20) {
            ctx.font = `600 ${Math.max(9, Math.round(10.5 * node.scale))}px var(--font-display, sans-serif)`;
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha + 0.2)})`;
            ctx.textAlign = 'center';
            ctx.fillText(node.label, node.px, node.py + rad + 12);
          }
        });

        ctx.restore();

        animId = requestAnimationFrame(loop);
      }

      loop();

      const cleanup = function() {
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouseMove);
      };
      canvas._csDestroy = cleanup;
      return { destroy: cleanup };
    }
  };

  window.CareSphere3D = CareSphere3D;
})(typeof window !== 'undefined' ? window : this);

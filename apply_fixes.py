import os
import re

def modify_file(filepath, callback):
    with open(filepath, 'r') as f:
        content = f.read()
    new_content = callback(content)
    if content != new_content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")

# 1. Update layout.tsx
def update_layout(content):
    if "import { ToastContainer }" not in content:
        content = content.replace("import { Footer } from '@/components/Footer';", "import { Footer } from '@/components/Footer';\nimport { ToastContainer } from '@/components/Toast';")
    if "<ToastContainer />" not in content:
        content = content.replace("<Footer />\n        </ThemeProvider>", "<Footer />\n          <ToastContainer />\n        </ThemeProvider>")
    return content

modify_file('/Users/drop/ISSHEREAL/src/app/layout.tsx', update_layout)

# 2. Append CSS to globals.css
css_to_add = """

/* Animate details/summary open/close (modern-web-guidance: animate-to-intrinsic-sizes) */
details > div {
  interpolate-size: allow-keywords;
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

/* Form validation feedback only after interaction */
input:user-invalid {
  border-color: #e11d48;
  background-color: oklch(95% 0.02 15);
}

.dark input:user-invalid {
  border-color: #fb7185;
  background-color: oklch(20% 0.02 15);
}

input:user-valid {
  border-color: #059669;
}

.dark input:user-valid {
  border-color: #34d399;
}

input:user-invalid + .validation-error {
  display: block;
}

.validation-error {
  display: none;
  color: #e11d48;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.dark .validation-error {
  color: #fb7185;
}

/* Container queries for self-aware components */
.cq-container {
  container-type: inline-size;
}

@container (max-width: 280px) {
  .cq-compact .metric-value {
    font-size: 1.25rem;
  }
  .cq-compact .metric-label {
    font-size: 0.625rem;
  }
}

@container (max-width: 200px) {
  .cq-compact .metric-detail {
    display: none;
  }
}

@keyframes slide-up-toast {
  from { opacity: 0; transform: translateY(16px) scale(0.95); }
  to { opacity: 1; transform: none; }
}
.animate-slide-up {
  animation: slide-up-toast 0.3s ease-out;
}

/* Scroll snap for mobile carousels */
.snap-x {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.snap-x::-webkit-scrollbar {
  display: none;
}
.snap-x {
  scrollbar-width: none;
}
"""
def update_globals(content):
    if "interpolate-size: allow-keywords;" not in content:
        return content + css_to_add
    return content

modify_file('/Users/drop/ISSHEREAL/src/app/globals.css', update_globals)

# 3. Analyze page: form validation
def update_analyze(content):
    # Find input: <input type="text" placeholder="Enter handle..."
    # Add required minLength={1} maxLength={64} pattern="[a-zA-Z0-9_.]+"
    if "minLength={1}" not in content:
        content = re.sub(
            r'(<input[^>]*?type="text"[^>]*?onChange=\{\(e\)\s*=>\s*setHandle\(e\.target\.value\)\}[^>]*?)(\/?>)',
            r'\1 required minLength={1} maxLength={64} pattern="[a-zA-Z0-9_.]+" \2',
            content,
            flags=re.DOTALL
        )
        # Add error element after input if not there
        # We find the input and add the span after it (but before the button possibly, or in the flex container).
        # Typically it's in a flex container with a button. Let's see if we can just append it inside the parent or after input.
    return content

modify_file('/Users/drop/ISSHEREAL/src/app/analyze/page.tsx', update_analyze)

# We will handle analyze/page and others more precisely if needed.

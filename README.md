# Pixel LERP — Image Morphing

**Course:** Human Computer Interaction — Week 08
**Files:** `index.html`, `js`,`cs`

---

## What is Pixel LERP?

The same LERP formula applied to pixel colours instead of shape vertices.
Every pixel has R, G, B values (0–255). Blending two images means:

```
R_out = (1 - t) * R_A  +  t * R_B
G_out = (1 - t) * G_A  +  t * G_B
B_out = (1 - t) * B_A  +  t * B_B
```

This runs for every single pixel — a 320×240 image = **76,800 calculations per frame**.

---

## Connection to Shape LERP

| Shape LERP | Pixel LERP |
|------------|------------|
| Blends vertex coordinates | Blends pixel colour values |
| Same formula | Same formula |
| Output = new shape | Output = new image frame |
| Animate t → shape morphs | Animate t → image morphs |

This is exactly the face morphing animation shown in the lecture slides.

---

## Core Code (3 key lines)

```js
for (let i = 0; i < dataA.length; i += 4) {
  out[i]   = (1-t) * A[i]   + t * B[i];   // Red
  out[i+1] = (1-t) * A[i+1] + t * B[i+1]; // Green
  out[i+2] = (1-t) * A[i+2] + t * B[i+2]; // Blue
  out[i+3] = 255;                            // Alpha
}
```

---

## How to Use `index.html`

1. Create an `images/` folder next to `index.html`
2. Place two images inside: `A.jpg` and `B.jpg`
3. Open `index.html` in browser
4. Drag the slider or press **▶ Animate**

```
your-folder/
├── index.html
└── images/
    ├── A.jpg
    └── B.jpg
```

> If images are not found, the demo falls back to a pink→blue colour blend
> so the LERP effect is still visible.

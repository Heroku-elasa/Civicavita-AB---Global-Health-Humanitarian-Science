# مستندات توابع پروژه (Function Documentation)

این سند توابع اصلی و سرویس‌های استفاده شده در برنامه Civicavita AB را تشریح می‌کند. هدف آن ارائه یک مرجع فنی برای توسعه و نگهداری آسان‌تر است.

---

## سرویس‌های Gemini (`services/geminiService.ts`)

این فایل شامل تمام تعاملات با Google Gemini API است.

### `generateReport(topic, description, reportType)`

-   **توضیحات:** یک گزارش متنی (مانند پروپوزال گرنت) را بر اساس موضوع، توضیحات و نوع گزارش انتخاب شده، تولید می‌کند.
-   **پارامترها:**
    -   `topic` (string): موضوع اصلی گزارش.
    -   `description` (string): جزئیات و نکات کلیدی برای تولید محتوا.
    -   `reportType` (string): نوع گزارش (مثلاً 'project_proposal').
-   **خروجی:** `Promise<string>` - یک Promise که به یک رشته متنی حاوی گزارش در فرمت Markdown حل می‌شود.

### `generateBlogPostWithImages(title, content, tone)`

-   **توضیحات:** یک پست وبلاگ کامل به همراه سه تصویر مرتبط تولید می‌کند. این تابع ابتدا از مدل متنی برای نوشتن محتوای پست و همچنین تولید سه پرامپت (دستور) مناسب برای تصاویر استفاده می‌کند. سپس، با استفاده از این پرامپت‌ها، سه تصویر با مدل `imagen-4.0-generate-001` ساخته و آن‌ها را در مکان‌های مناسب (ابتدا، وسط و انتهای پست) در متن Markdown جایگذاری می‌کند.
-   **پارامترها:**
    -   `title` (string): عنوان پست وبلاگ.
    -   `content` (string): محتوای اصلی یا طرح کلی که توسط کاربر ارائه شده.
    -   `tone` (string): لحن مورد نظر برای نوشته (مثلاً 'professional', 'casual').
-   **خروجی:** `Promise<string>` - یک Promise که به یک رشته کامل Markdown حاوی متن پست و سه تصویر جاسازی شده (به صورت base64) حل می‌شود.

### `findGrants(keywords)`

-   **توضیحات:** با استفاده از مدل Gemini، گرنت‌های مرتبط با کلمات کلیدی کاربر را جستجو و در قالب یک آرایه JSON برمی‌گرداند.
-   **پارامترها:**
    -   `keywords` (string): کلمات کلیدی وارد شده توسط کاربر برای جستجو.
-   **خروجی:** `Promise<Grant[]>` - یک Promise که به آرایه‌ای از اشیاء `Grant` حل می‌شود.

### `analyzeGrant(grant, userProfile)`

-   **توضیحات:** یک گرنت مشخص را بر اساس پروفایل کاربر تحلیل کرده و یک خلاصه ساختاریافته در قالب JSON برمی‌گرداند.
-   **پارامترها:**
    -   `grant` (Grant): شیء گرنتی که باید تحلیل شود.
    -   `userProfile` (string): پروفایل کاربر برای ارزیابی میزان ارتباط گرنت.
-   **خروجی:** `Promise<GrantSummary>` - یک Promise که به یک شیء JSON با جزئیات کامل گرنت (مانند مبلغ، ددلاین، شرایط و ...) حل می‌شود.

### `generateVideoScript(...)`

-   **توضیحات:** یک اسکریپت ویدیویی کامل، شامل صحنه‌ها، نریشن و توضیحات بصری را بر اساس ورودی کاربر (متن و/یا تصویر) تولید می‌کند.
-   **پارامترها:**
    -   `prompt` (string): توضیحات کاربر در مورد مفهوم ویدیو.
    -   `image` (string | null): تصویر مرجع (base64) برای راهنمایی سبک بصری.
    -   `duration` (number): مدت زمان تقریبی ویدیو به ثانیه.
    -   `videoType` ('general' | 'research_showcase'): نوع ویدیو.
-   **خروجی:** `Promise<ScriptScene[]>` - یک Promise که به آرایه‌ای از اشیاء `ScriptScene` حل می‌شود.

### `generateSceneVideo(description)`

-   **توضیحات:** (شبیه‌سازی شده) یک کلیپ ویدیویی کوتاه برای یک صحنه خاص بر اساس توضیحات بصری آن تولید می‌کند.
-   **پارامترها:**
    -   `description` (string): توضیحات بصری برای هوش مصنوعی.
-   **خروجی:** `Promise<string[]>` - یک Promise که به آرایه‌ای از URLهای ویدیوهای تولید شده حل می‌شود.

### `generateSceneImage(description)`

-   **توضیحات:** یک تصویر ثابت برای یک صحنه بر اساس توضیحات بصری آن با استفاده از مدل `imagen-4.0-generate-001` تولید می‌کند.
-   **پارامترها:**
    -   `description` (string): توضیحات بصری برای تولید تصویر.
-   **خروجی:** `Promise<string>` - یک Promise که به یک URL داده (Data URL) از تصویر تولید شده (base64) حل می‌شود.

### `askGoogleBabaAboutImage(image, userFocus)`

-   **توضیحات:** یک تصویر را تحلیل کرده و با استفاده از جستجوی وب (Google Search grounding)، اطلاعاتی در مورد آن ارائه می‌دهد.
-   **پارامترها:**
    -   `image` (object): شیء تصویر شامل `data` (base64) و `mimeType`.
    -   `userFocus` (string | undefined): سوال یا تمرکز خاص کاربر.
-   **خروجی:** `Promise<GrantResult>` - یک شیء با `text` (پاسخ متنی) و `sources` (منابع وب) برمی‌گرداند.

### `generateMusicDescription(prompt)`

-   **توضیحات:** بر اساس مفهوم ویدیو، یک توصیف متنی برای موسیقی پس‌زمینه مناسب تولید می‌کند.
-   **پارامترها:**
    -   `prompt` (string): مفهوم ویدیوی کاربر.
-   **خروجی:** `Promise<string>` - یک Promise که به یک متن توصیفی برای موسیقی حل می‌شود.

---

## English Documentation

This document describes the main functions and services used in the Civicavita AB application. It aims to provide a technical reference for easier development and maintenance.

---

## Gemini Services (`services/geminiService.ts`)

This file contains all interactions with the Google Gemini API.

### `generateReport(topic, description, reportType)`

-   **Description:** Generates a text-based report (e.g., a grant proposal) based on the provided topic, description, and selected report type.
-   **Parameters:**
    -   `topic` (string): The main subject of the report.
    -   `description` (string): Key details and points to include in the content.
    -   `reportType` (string): The type of report (e.g., 'project_proposal').
-   **Returns:** `Promise<string>` - A promise that resolves to a Markdown-formatted string of the report.

### `generateBlogPostWithImages(title, content, tone)`

-   **Description:** Generates a complete blog post with three relevant images. This function first uses the text model to write the post's content and also to generate three suitable prompts for images. Then, using these prompts, it creates three images with the `imagen-4.0-generate-001` model and places them in appropriate locations (beginning, middle, and end) within the Markdown text.
-   **Parameters:**
    -   `title` (string): The title of the blog post.
    -   `content` (string): The main content or outline provided by the user.
    -   `tone` (string): The desired tone for the writing (e.g., 'professional', 'casual').
-   **Returns:** `Promise<string>` - A promise that resolves to a complete Markdown string containing the post's text and three embedded images (as base64).

### `findGrants(keywords)`

-   **Description:** Searches for grants related to the user's keywords using the Gemini model and returns them as a JSON array.
-   **Parameters:**
    -   `keywords` (string): The keywords entered by the user for the search.
-   **Returns:** `Promise<Grant[]>` - A promise that resolves to an array of `Grant` objects.

### `analyzeGrant(grant, userProfile)`

-   **Description:** Analyzes a specific grant based on the user's profile and returns a structured summary in JSON format.
-   **Parameters:**
    -   `grant` (Grant): The grant object to be analyzed.
    -   `userProfile` (string): The user's profile to assess the grant's relevance.
-   **Returns:** `Promise<GrantSummary>` - A promise that resolves to a JSON object with the full grant details (e.g., amount, deadline, eligibility).

### `generateVideoScript(...)`

-   **Description:** Generates a complete video script, including scenes, narration, and visual descriptions, based on user input (text and/or image).
-   **Parameters:**
    -   `prompt` (string): The user's description of the video concept.
    -   `image` (string | null): A reference image (base64) to guide the visual style.
    -   `duration` (number): The approximate duration of the video in seconds.
    -   `videoType` ('general' | 'research_showcase'): The type of video.
-   **Returns:** `Promise<ScriptScene[]>` - A promise that resolves to an array of `ScriptScene` objects.

### `generateSceneVideo(description)`

-   **Description:** (Simulated) Generates a short video clip for a specific scene based on its visual description.
-   **Parameters:**
    -   `description` (string): The visual description for the AI.
-   **Returns:** `Promise<string[]>` - A promise that resolves to an array of URLs for the generated videos.

### `generateSceneImage(description)`

-   **Description:** Generates a still image for a scene based on its visual description using the `imagen-4.0-generate-001` model.
-   **Parameters:**
    -   `description` (string): The visual description for image generation.
-   **Returns:** `Promise<string>` - A promise that resolves to a Data URL of the generated image (base64).

### `askGoogleBabaAboutImage(image, userFocus)`

-   **Description:** Analyzes an image and provides information about it using Google Search grounding.
-   **Parameters:**
    -   `image` (object): The image object containing `data` (base64) and `mimeType`.
    -   `userFocus` (string | undefined): The user's specific question or focus.
-   **Returns:** `Promise<GrantResult>` - An object containing `text` (textual response) and `sources` (web sources).

### `generateMusicDescription(prompt)`

-   **Description:** Generates a text description for suitable background music based on the video concept.
-   **Parameters:**
    -   `prompt` (string): The user's video concept.
-   **Returns:** `Promise<string>` - A promise that resolves to a descriptive text for the music.

import {
  ArrowUpRight,
  Award,
  BookOpen,
  Check,
  ChevronRight,
  CircleDot,
  GraduationCap,
  MapPin,
  Menu,
  Phone,
  Quote,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import { getGalleryImages } from "@/lib/gallery";

const standardPillars = [
  {
    number: "01",
    title: "Precision in Curriculum",
    description:
      'Every module is developed with meticulous attention to detail, ensuring that our "Early Childhood" and "Art & Craft" programs are of the highest pedagogical concentration.',
    tone: "saffron",
  },
  {
    number: "02",
    title: "Skill-First Methodology",
    description:
      'We move beyond the "one-size-fits-all" model. Whether it is our 1-year professional diplomas or our intensive 5 and 7-day workshops, we focus on the specific, practical skills teachers need to excel in the workspace.',
    tone: "blue",
  },
  {
    number: "03",
    title: "Future-Ready Foundations",
    description:
      "While we are rooted in the timeless Montessori method, we also keep a close eye on emerging trends in technology and industry to ensure our educators are prepared for the world of tomorrow.",
    tone: "coral",
  },
  {
    number: "04",
    title: "Inclusive & Special Child Education",
    description:
      "Every child deserves equal opportunities to learn, grow, and succeed. Our training introduces future teachers to child-centred strategies that support children with different learning abilities, developmental needs, and educational backgrounds in a positive, respectful environment.",
    tone: "saffron",
  },
];

const courses = [
  {
    number: "01",
    title: "Advanced Diploma in Montessori and Pre-School Management",
    description:
      "Montessori methodology, preschool management, child psychology, classroom organisation, activity planning and day care administration.",
    tone: "saffron",
  },
  {
    number: "02",
    title: "BSS Diploma in Nursery Education",
    description:
      "Child development, classroom management, activity-based learning and preschool teaching methods.",
    tone: "blue",
  },
  {
    number: "03",
    title: "BSS Diploma in Primary Education",
    description:
      "Primary-level teaching methodologies and child-centered education for aspiring primary teachers.",
    tone: "coral",
  },
  {
    number: "04",
    title: "BSS Diploma in Creche and Pre-School Management",
    description:
      "Preschool administration, daycare management, child safety, nutrition and communication.",
    tone: "saffron",
  },
  {
    number: "05",
    title: "Advanced Diploma in Montessori and Child Education",
    description:
      "Practical teaching methods, Montessori materials handling, lesson planning and classroom activities.",
    tone: "blue",
  },
  {
    number: "06",
    title: "BSS Diploma in Early Childhood Care and Education",
    description:
      "Holistic child development, psychology, learning methods and health education.",
    tone: "coral",
  },
];

const govtCertificate = [
  "Government recognized vocational certification",
  "Skill-based professional qualification",
  "Useful for employment and career development",
  "Recognized by many educational and training institutions",
];

const wscCertificate = [
  "International skill certification",
  "Adds professional credibility",
  "Enhances global career opportunities",
  "Improves professional profile and employability",
];

const certBenefits = [
  "Higher professional value",
  "Better employment opportunities",
  "Recognition in private educational institutions",
  "Strong foundation for preschool teaching careers",
  "Career growth in Montessori and childcare sectors",
  "Useful for starting your own preschool or daycare centre",
];

const whyChoose = [
  "100% employment-focused curriculum, built around real school needs",
  "Hands-on practice with genuine Montessori apparatus and art-and-craft tools",
  '"Pre-School Management" modules to help you start your own Montessori school',
  "National and international certification, prioritised for leadership roles",
];

const jobRoles = [
  "Montessori Teacher",
  "Pre-School Teacher",
  "Kindergarten Teacher",
  "Daycare Coordinator",
  "Childcare Assistant",
  "Nursery Teacher",
  "Early Childhood Educator",
  "Activity Coordinator",
  "Creche Supervisor",
  "School Administrator",
];

const ventures = [
  "Montessori School",
  "Play School",
  "Daycare Centre",
  "Home Tuition Centre",
  "Early Learning Centre",
];

const methodology = [
  "Montessori teaching techniques",
  "Hands-on classroom activities",
  "Child observation methods",
  "Teaching practice sessions",
  "Creative learning activities",
  "Storytelling and communication skills",
  "Teaching aid preparation",
  "Child behavior understanding",
  "Classroom management skills",
  "Interactive learning sessions",
];

// Force this page to render per-request rather than being prerendered at
// build time, so newly uploaded gallery photos show up without a redeploy.
export const dynamic = "force-dynamic";

export default async function Home() {
  const gallery = (await getGalleryImages()).slice(0, 20);
  return (
    <main className="site-shell">
      <div className="announcement">
        <span className="announcement-dot" />
        Admissions open for the next teacher training batch &middot; Reg. No.
        TN/7263
        <a href="#contact">
          Enquire now <ArrowUpRight size={14} />
        </a>
      </div>

      <nav className="nav-wrap" aria-label="Primary navigation">
        <a
          className="brand"
          href="#top"
          aria-label="Indian Montessori Training Institute home"
        >
          <span className="brand-mark">
            <Sparkles size={17} strokeWidth={2.5} />
          </span>
          <span>
            <strong>IMTI</strong>
            <small>Indian Montessori Training Institute</small>
          </span>
        </a>
        <div className="nav-links">
          <a href="#about">About us</a>
          <a href="#courses">Courses</a>
          <a href="#certification">Certification</a>
          <a href="#careers">Careers</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#contact">
          Start your journey <ArrowUpRight size={16} />
        </a>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <Menu size={23} />
          </summary>
          <div className="mobile-drawer">
            <a href="#about">About us</a>
            <a href="#courses">Courses</a>
            <a href="#certification">Certification</a>
            <a href="#careers">Careers</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
        </details>
      </nav>

      <section className="hero section-pad" id="top">
        <div className="hero-copy">
          <p className="eyebrow">
            <CircleDot size={13} fill="currentColor" /> Artisanal excellence in
            teacher training
          </p>
          <h1>
            Teach the child.
            <br />
            <em>Shape the future.</em>
          </h1>
          <p className="hero-intro">
            Government-approved, dual-certified Montessori teacher training in
            Salem, Tamil Nadu &mdash; for educators who believe every child
            deserves a thoughtful beginning.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="#courses">
              Explore our courses <ChevronRight size={17} />
            </a>
            <a className="text-link" href="#about">
              Discover our approach <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>
                <Image src="/1.jpg" alt="" fill sizes="32px" />
              </span>
              <span>
                <Image src="/3.jpg" alt="" fill sizes="32px" />
              </span>
              <span>
                <Image src="/4.jpg" alt="" fill sizes="32px" />
              </span>
            </div>
            <p>
              <strong>Graduating batches</strong>
              <br />
              trained under Mrs. P. Rooba
            </p>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame">
            <Image
              src="/2.jpg"
              alt="Montessori teacher training session in a colourful classroom"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 48vw"
            />
          </div>
          <div className="hero-sticker">
            <span>Learn</span>
            <strong>
              with
              <br />
              purpose
            </strong>
            <Sparkles size={19} />
          </div>
          <div className="hero-note">
            <span className="note-line" />
            <span>Reg. No. TN/7263</span>
            <strong>
              Govt. &amp; WSC
              <br />
              recognised
            </strong>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Institute highlights">
        <div>
          <span className="trust-icon">
            <GraduationCap size={20} />
          </span>
          <p>
            <strong>Government-approved</strong>
            <small>course pathways</small>
          </p>
        </div>
        <div>
          <span className="trust-icon">
            <Award size={20} />
          </span>
          <p>
            <strong>Dual certification</strong>
            <small>Central Govt. &amp; WSC</small>
          </p>
        </div>
        <div>
          <span className="trust-icon">
            <BookOpen size={20} />
          </span>
          <p>
            <strong>Practice-led learning</strong>
            <small>for the real classroom</small>
          </p>
        </div>
        <div className="trust-wordmark">
          IMTI <span>Salem · Tamil Nadu</span>
        </div>
      </section>

      <section className="about section-pad" id="about">
        <div className="section-label">01 / The IMTI philosophy</div>
        <div className="about-grid">
          <div className="about-heading">
            <h2>
              Education begins
              <br />
              with <em>attention.</em>
            </h2>
            <div className="sun-disc" aria-hidden="true">
              <Sparkles size={31} />
            </div>
          </div>
          <div className="about-content">
            <p className="lead">
              Education is not a mass-produced commodity, but a finely crafted
              discipline &mdash; Artisanal Excellence in Training.
            </p>
            <div className="founder-row">
              <span className="founder-avatar">
                <Image
                  src="/3.jpg"
                  alt="Mrs. P. Rooba, founder of IMTI"
                  fill
                  sizes="46px"
                  className="object-cover"
                />
              </span>
              <span>
                <strong>Mrs. P. Rooba</strong>
                <span>Founder, Indian Montessori Training Institute</span>
              </span>
            </div>
            <p>
              Just as a master craftsman perfects every detail of a rare
              creation, we approach teacher training with precision,
              high-standard methodology, and a deep respect for the
              &ldquo;prepared environment.&rdquo; Based in North Alagapuram,
              Salem, IMTI empowers local women and aspiring educators with
              professional-grade skills, raising the standard of early childhood
              education across the region.
            </p>
            <h3 className="mini-heading">
              Why early childhood education matters
            </h3>
            <p>
              Early childhood is the most important stage in a child&apos;s
              development. A trained Montessori educator helps children build
              confidence, creativity, communication skills, discipline, and
              independent learning habits.
            </p>
            <p>
              The demand for qualified preschool teachers and childcare
              professionals is increasing rapidly in India and abroad.
              Professional Montessori training creates strong career
              opportunities for individuals passionate about teaching and child
              development &mdash; and IMTI aims to create skilled educators who
              can positively shape the future generation through quality
              education and care.
            </p>
            <a className="text-link dark-link" href="#certification">
              See our dual certification <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <section className="standard section-pad" id="standard">
        <div className="section-topline">
          <div>
            <div className="section-label">02 / The IMTI standard</div>
            <h2>
              Precision
              <br />
              <em>&amp; passion.</em>
            </h2>
          </div>
          <p>
            We bridge the gap between traditional wisdom and modern industrial
            standards. Drawing inspiration from global skill frameworks, our
            curriculum meets the evolving needs of the 21st-century classroom.
          </p>
        </div>
        <div className="course-grid">
          {standardPillars.map((pillar) => (
            <article
              className={`course-card ${pillar.tone}`}
              key={pillar.number}
            >
              <div className="course-number">{pillar.number}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="courses section-pad" id="courses">
        <div className="section-topline">
          <div>
            <div className="section-label">03 / Find your path</div>
            <h2>
              One year to a
              <br />
              <em>meaningful career.</em>
            </h2>
          </div>
          <p>
            Six job-oriented diploma programs covering Montessori method, child
            care, and pre-school management &mdash; open to 10th, 12th and
            degree holders.
          </p>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <article
              className={`course-card ${course.tone}`}
              key={course.number}
            >
              <div className="course-number">{course.number}</div>
              <div className="course-icon">
                <GraduationCap size={25} />
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <a
                href="#contact"
                aria-label={`Learn more about ${course.title}`}
              >
                Learn more <ArrowUpRight size={16} />
              </a>
            </article>
          ))}
        </div>
        <div className="course-footer">
          <span>
            Also available: 5 &amp; 7-day intensive workshops &middot; Dual
            certification (Govt. + WSC) on every course
          </span>
          <a href="#certification">
            See certification details <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <section className="certification section-pad" id="certification">
        <div className="section-topline">
          <div>
            <div className="section-label">04 / Dual certification</div>
            <h2>
              One course.
              <br />
              <em>Two valuable certificates.</em>
            </h2>
          </div>
          <p>
            Every graduate receives both a Central Government Certificate and a
            World Skill Council (WSC) Certificate &mdash; recognised nationally
            and internationally.
          </p>
        </div>
        <div className="cert-grid">
          <article className="course-card cert-card blue">
            <span className="cert-tag">Central Government</span>
            <h3>Government Certificate</h3>
            <ul>
              {govtCertificate.map((item) => (
                <li key={item}>
                  <span>
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="course-card cert-card coral">
            <span className="cert-tag">World Skill Council</span>
            <h3>WSC Certificate</h3>
            <ul>
              {wscCertificate.map((item) => (
                <li key={item}>
                  <span>
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
        <div className="cert-benefits">
          <span>Why dual certification matters</span>
          <div className="pill-row">
            {certBenefits.map((item) => (
              <span className="pill" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Eligibility">
        <div>
          <span className="trust-icon">10th</span>
          <p>
            <strong>10th Standard</strong>
            <small>eligible to apply</small>
          </p>
        </div>
        <div>
          <span className="trust-icon">12th</span>
          <p>
            <strong>12th Standard</strong>
            <small>eligible to apply</small>
          </p>
        </div>
        <div>
          <span className="trust-icon">UG</span>
          <p>
            <strong>Any Degree</strong>
            <small>eligible to apply</small>
          </p>
        </div>
        <div className="trust-wordmark">
          Open to all. <span>Homemakers &amp; career returners welcome</span>
        </div>
      </section>

      <section className="journey section-pad" id="approach">
        <div className="journey-image">
          <Image
            src="/4.jpg"
            alt="Teacher sitting with children during a Montessori activity"
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="journey-copy">
          <div className="section-label">05 / More than a certificate</div>
          <h2>
            A classroom is a<br />
            <em>living thing.</em>
          </h2>
          <p className="lead">So is the teacher at its centre.</p>
          <p>
            We believe the best preparation happens when ideas meet experience.
            That is why our training is personal, practical, and connected to
            the children and communities you will serve in and around Salem.
          </p>
          <ul>
            {whyChoose.map((item) => (
              <li key={item}>
                <span>
                  <Check size={14} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <a className="text-link dark-link" href="#contact">
            Talk to an admissions guide <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <section className="careers section-pad" id="careers">
        <div className="section-topline">
          <div>
            <div className="section-label">06 / Where this leads</div>
            <h2>
              Build a career,
              <br />
              <em>or build a school.</em>
            </h2>
          </div>
          <p>
            The course provides both theoretical knowledge and practical
            teaching experience to prepare you for real classroom environments.
          </p>
        </div>
        <div className="careers-grid">
          <div className="careers-block">
            <h3>After completing the course, work as:</h3>
            <div className="pill-row">
              {jobRoles.map((role) => (
                <span className="pill" key={role}>
                  {role}
                </span>
              ))}
            </div>
          </div>
          <div className="careers-block">
            <h3>Or start your own:</h3>
            <div className="pill-row">
              {ventures.map((venture) => (
                <span className="pill outline" key={venture}>
                  {venture}
                </span>
              ))}
            </div>
            <p>
              Our &ldquo;Pre-School Management&rdquo; modules give you the legal
              and administrative grounding to launch and run your own
              institution with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="methodology section-pad">
        <div className="section-topline">
          <div>
            <div className="section-label">07 / Teaching methodology</div>
            <h2>
              Practical learning,
              <br />
              <em>real experience.</em>
            </h2>
          </div>
          <p>
            At IMTI, we believe teaching is best learned through practice.
            Students receive hands-on exposure that builds confidence.
          </p>
        </div>
        <div className="method-grid">
          {methodology.map((item, i) => (
            <div className="method-item" key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="gallery" aria-label="Life at IMTI" id="gallery">
        <div className="gallery-header">
          <div>
            <div className="section-label">Life at IMTI</div>
            <h2>
              Inside our
              <br />
              <em>classrooms &amp; campus.</em>
            </h2>
          </div>
        </div>
        <GalleryLightbox images={gallery} />
      </section>

      <section className="quote-section section-pad">
        <Quote className="quote-mark" size={42} />
        <blockquote>
          "The child gives us a beautiful lesson — that in order to form and
          maintain our intelligence, we must use our hands."
        </blockquote>
        <p>— Dr. Maria Montessori</p>
      </section>

      <section className="contact section-pad" id="contact">
        <div className="section-topline">
          <div>
            <div className="section-label light-label">
              08 / Your next chapter
            </div>
            <h2>
              Ready to begin
              <br />
              <em>with purpose?</em>
            </h2>
          </div>
          <p>
            Tell us a little about where you are, and we&apos;ll help you find
            the right path into Montessori education.
          </p>
        </div>
        <div className="contact-panels">
          <div className="contact-card">
            <span>Admissions office</span>
            <strong>
              Let&apos;s talk about
              <br />
              your journey.
            </strong>
            <div className="contact-rows">
              <div className="contact-row">
                <span className="contact-row-icon">
                  <MapPin size={17} />
                </span>
                <address>
                  3/74A, Nagaramalai Road, North Alagapuram,
                  <br />
                  Near Thirowpathi Amman Temple,
                  <br />
                  Salem &ndash; 636016, Tamil Nadu
                </address>
              </div>
              <div className="contact-row">
                <span className="contact-row-icon">
                  <Phone size={16} />
                </span>
                <div className="contact-row-numbers">
                  <a href="tel:+919789246768">97892 46768</a>
                  <a href="tel:+918608654555">86086 54555</a>
                </div>
              </div>
            </div>
            <a href="tel:+919789246768" className="contact-button">
              <Phone size={15} /> Call to enquire
            </a>
            <small>Reg. No. TN/7263</small>
          </div>
          <div className="contact-map">
            <iframe
              title="IMTI location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=3%2F74A%2C+Nagaramalai+Road%2C+North+Alagapuram%2C+Salem+636016&output=embed"
            />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="brand footer-brand">
          <span className="brand-mark">
            <Sparkles size={17} strokeWidth={2.5} />
          </span>
          <span>
            <strong>IMTI</strong>
            <small>Indian Montessori Training Institute</small>
          </span>
        </div>
        <p>Inspire minds. Nurture potential.</p>
        <span>© 2026 IMTI, Salem · Reg. No. TN/7263</span>
      </footer>
    </main>
  );
}

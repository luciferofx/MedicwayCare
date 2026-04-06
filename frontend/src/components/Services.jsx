import ServiceCard from "./ServiceCard";
import {
  Heart,
  Brain,
  Bone,
  Activity,
  Baby,
  User,
  Scale,
  Hospital,
  Droplet,
} from "lucide-react";

/* ===========================
   STATIC DYNAMIC DATA SOURCE
=========================== */
const specialties = [
  {
    icon: Brain,
    title: "Psychotherapy",
    description: "Evidence-based talk therapy for various mental health conditions.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: User,
    title: "CBT",
    description: "Cognitive Behavioral Therapy to manage thoughts and behaviors.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Baby,
    title: "Child Psychology",
    description: "Developmental and emotional support for children and adolescents.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Heart,
    title: "Relationship Counseling",
    description: "Specialized support for couples and family dynamics.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Activity,
    title: "Stress Management",
    description: "Effective techniques to handle daily stress and burnout.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Droplet,
    title: "Addiction Therapy",
    description: "Support for substance abuse and behavioral addictions.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: User,
    title: "Trauma Recovery",
    description: "Specialized care for PTSD and emotional trauma.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: Brain,
    title: "Clinical Assessments",
    description: "Comprehensive psychological testing and diagnostics.",
    iconColor: "bg-[#008080]",
  },
  {
    icon: User,
    title: "Corporate Wellness",
    description: "Mental health support programs for workplaces.",
    iconColor: "bg-[#008080]",
  },
];

/* ===========================
   SERVICES COMPONENT
=========================== */
export default function Services() {
  return (
    <section className="bg-sectiondiv">
      <div className="container mx-auto py-12">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-darktext mb-4">
            Our Psychology Specializations
          </h2>
          <p className="text-lg text-lighttext max-w-3xl mx-auto">
            Providing expert care across various domains of clinical psychology
            to support your journey towards mental wellness.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 mx-auto">
          {specialties.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

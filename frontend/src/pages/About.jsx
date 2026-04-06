import { motion } from 'framer-motion';
import { HeartPulse, Stethoscope, Users } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function About() {
  const data = {
    title: 'About Us',
    subtitle: "Empowering your journey towards mental well-being and emotional balance",
    missionTitle: 'Our Mission',
    missionDescription:
      'MedicwayCare is a dedicated platform for clinical psychology and mental wellness. We connect individuals with world-class psychologists and therapy centers, providing evidence-based care, professional guidance, and a supportive environment for mental health recovery.',
    image:
      'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    highlights: [
      { icon: 'HeartPulse', text: 'Providing clarity in mental health care' },
      { icon: 'Stethoscope', text: 'Evidence-based therapeutic approaches' },
      { icon: 'Users', text: 'Confidential and compassionate support' },
    ],
    email: 'contact@medicwaycare.com',
    whatsappNumber: '9354799090',
    whatsappMessage: 'Hello! I have a question about your psychology services.',
    isActive: true,
    updatedAt: null, // will show "Invalid Date" as requested
  };

  const iconMap = {
    HeartPulse: <HeartPulse className="w-5 h-5 text-teal-600" />,
    Stethoscope: <Stethoscope className="w-5 h-5 text-teal-600" />,
    Users: <Users className="w-5 h-5 text-teal-600" />,
  };

  return (
    <>
      <Helmet>
        <title>About MedicwayCare - Clinical Psychology & Mental Wellness</title>
        <meta name="description" content="Learn about MedicwayCare, your trusted partner for clinical psychology and mental health services. We connect you with top psychologists and therapy centers." />
        <meta name="keywords" content="about us, clinical psychology, mental health, psychotherapy, counseling" />
      </Helmet>
      <section className="relative bg-white py-16 overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-50 rounded-full blur-xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-50 rounded-full blur-xl opacity-50" />

      <div className="container relative mx-auto px-6 md:px-12 lg:px-20 py-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-teal-800">
            About <span className="text-teal-600">Us</span>
          </h1>
          <div className="w-20 h-1 bg-teal-500 mx-auto mt-4" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-lg text-gray-700 text-center max-w-3xl mx-auto leading-relaxed mb-12"
        >
          {data.subtitle}
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-teal-50 rounded-2xl" />
            <img
              src={data.image}
              alt="Healthcare team"
              className="relative rounded-xl shadow-md z-10 w-full h-auto"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-semibold text-teal-800 mb-6">
              {data.missionTitle}
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              {data.missionDescription}
            </p>

            {/* Highlights */}
            <div className="space-y-4">
              {data.highlights.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-3 bg-teal-50 rounded-lg"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-teal-100 rounded-full">
                    {iconMap[item.icon]}
                  </div>
                  <span className="text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <h3 className="text-xl font-semibold text-teal-800 mb-4">
                Contact Us
              </h3>
              <p className="text-gray-700">Email: {data.email}</p>
              <p className="text-gray-700">
                WhatsApp:{' '}
                <a
                  href={`https://wa.me/${data.whatsappNumber}`}
                  className="text-teal-600 hover:underline"
                >
                  {data.whatsappNumber} ({data.whatsappMessage})
                </a>
              </p>
              <p className="text-gray-700">
                Status: {data.isActive ? 'Active' : 'Inactive'}
              </p>
              <p className="text-gray-700">
                Last Updated:{' '}
                {new Date(data.updatedAt).toLocaleDateString()}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 bg-teal-50 rounded-xl p-8 md:p-10"
        >
          <h3 className="text-xl font-semibold text-teal-800 mb-4 text-center">
            Our Commitment to You
          </h3>
          <p className="text-gray-700 text-center max-w-3xl mx-auto">
            We believe that everyone deserves access to quality mental health care.
            Our platform is designed to empower individuals with the tools they need 
            to foster resilience, emotional strength, and overall well-being.
          </p>
        </motion.div>
      </div>
    </section>
    </>
  );
}

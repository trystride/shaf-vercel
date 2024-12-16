'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bell, 
  Shield, 
  Zap, 
  BarChart, 
  Users, 
  Download, 
  Globe, 
  ArrowRight,
  Search,
  Bell as BellIcon,
  Sparkles,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Custom Keyword Tracking",
    description: "Set up personalized alerts for company names, business entities, or specific terms",
    icon: Bell,
  },
  {
    title: "Real-Time Updates",
    description: "Receive instant notifications when your keywords appear in bankruptcy announcements",
    icon: Zap,
  },
  {
    title: "Multi-Source Coverage",
    description: "Monitor announcements from bankruptcy.gov.sa and leading Saudi newspapers",
    icon: Globe,
  },
  {
    title: "Intelligent Matching",
    description: "Advanced algorithms ensure you never miss relevant announcements",
    icon: BarChart,
  },
];

const sources = [
  {
    logo: "/images/logos/Al-Jazirah-01.svg",
  },
  {
    logo: "/images/logos/Alwatan-01.svg",
  },
  {
    logo: "/images/logos/Alyawm-01.svg",
  },
  {
    logo: "/images/logos/شعار جريدة الرياض.svg",
  },
  {
    logo: "/images/logos/شعار صحيفة مكة – SVG.svg",
  },
  {
    logo: "/images/logos/شعار وزارة التجارة SVG.svg",
  },
  {
    logo: "/images/logos/شعار لجنة الإفلاس – إيسار – الجديد بدقة عالية png – SVG.svg",
  },
  {
    logo: "/images/logos/ajel-sa.svg",
  }
];

const stats = [
  { id: 1, name: 'Active Users', value: '500+' },
  { id: 2, name: 'Daily Alerts', value: '10K+' },
  { id: 3, name: 'Success Rate', value: '99.9%' },
  { id: 4, name: 'Sources Monitored', value: '15+' },
];

const steps = [
  {
    name: 'Set Your Keywords',
    description: 'Add company names, business entities, or specific terms you want to track.',
    icon: Search,
  },
  {
    name: 'Automated Monitoring',
    description: 'Our system continuously monitors multiple sources for your keywords.',
    icon: BellIcon,
  },
  {
    name: 'Instant Notifications',
    description: 'Receive real-time alerts when your keywords are mentioned.',
    icon: Sparkles,
  },
];

const faqs = [
  {
    question: "How often is the data updated?",
    answer: "Our system fetches new announcements every 2 hours from all sources, ensuring you stay up-to-date with the latest information."
  },
  {
    question: "What sources do you monitor?",
    answer: "We currently monitor bankruptcy.gov.sa and major Saudi newspapers. We're continuously expanding our sources to include more publications and social media platforms."
  },
  {
    question: "How do I get started?",
    answer: "Simply sign up for an account, add your keywords, and start receiving alerts. The setup process takes less than 5 minutes."
  },
  {
    question: "Can I customize my notifications?",
    answer: "Yes, you can choose how and when you receive notifications. Options include email alerts, dashboard notifications, and more."
  }
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate pt-14">
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Stay Ahead with{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Real-Time</span>
                </span>{" "}
                Business Intelligence
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
                Transform the way you track important business announcements across Saudi Arabia's most trusted sources.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/auth/sign-up">
                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 text-lg rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg rounded-full border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Request Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-lg font-semibold leading-8 text-gray-900 dark:text-white">
              Our Growing Network
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-16">
              Trusted sources across Saudi Arabia's media landscape
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {sources.map((source, index) => (
              <div
                key={index}
                className="relative h-16 w-full flex items-center justify-center"
              >
                <img
                  src={source.logo}
                  alt="Source logo"
                  className="max-h-12 w-full object-contain filter dark:invert"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Trusted by Businesses Across Saudi Arabia
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Join hundreds of businesses that rely on our platform for critical updates
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-gray-50/80 dark:bg-gray-800/80 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-medium tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Precision Monitoring
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card 
                  key={index} 
                  className="relative overflow-hidden rounded-3xl p-8 shadow-sm transition-all duration-200 hover:shadow-lg dark:bg-gray-800/50"
                >
                  <div className="relative z-10">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20">
                      <feature.icon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              How It Works
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {steps.map((step, stepIdx) => (
                <div key={stepIdx} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-indigo-600">
                      <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {step.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-400">
                    <p className="flex-auto">{step.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl divide-y divide-gray-900/10 dark:divide-gray-100/10">
            <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white text-center mb-16">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-lg font-semibold text-left text-gray-900 dark:text-white">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start Monitoring Today
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Don't miss critical business announcements. Sign up now and stay ahead of market movements.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg rounded-full font-medium"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white/10 px-8 py-6 text-lg rounded-full"
                >
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl" aria-hidden="true">
          <div className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25" />
        </div>
      </section>
    </>
  );
}

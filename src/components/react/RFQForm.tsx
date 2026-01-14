import * as Label from '@radix-ui/react-label';
import {
  User,
  Building2,
  Briefcase,
  Warehouse,
  Factory,
  Truck,
  Network,
  Wrench,
  Cpu,
  Calendar,
  Package,
} from 'lucide-react';
import { site } from '../../data/site';

const formCopy = site.pages.contact.form;
const { sections } = formCopy;
const serviceIcons: Record<string, typeof Briefcase> = {
  warehousing: Warehouse,
  manufacturing: Factory,
  transportation: Truck,
  'supply-chain': Network,
  'value-added': Wrench,
  technology: Cpu,
};

export default function RFQForm() {
  return (
    <form
      className="space-y-6"
      id="rfq-form"
      name="rfq-form"
      method="post"
      action="https://usebasin.com/f/7675ff71642b"
      noValidate
    >
      <div>
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-600 to-teal-600 flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{sections.contact.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label.Root
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {sections.contact.firstNameLabel}
              <span className="ml-2 text-xs text-gray-400">(Optional)</span>
            </Label.Root>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {sections.contact.lastNameLabel}
              <span className="ml-2 text-xs text-gray-400">(Optional)</span>
            </Label.Root>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <Label.Root
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {sections.contact.emailLabel} <span className="text-red-500">*</span>
            </Label.Root>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-600 to-emerald-600 flex items-center justify-center mr-3">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{sections.requirements.title}</h2>
        </div>
        <div className="space-y-6">
          <div>
            <Label.Root className="block text-sm font-medium text-gray-700 mb-3">
              {sections.requirements.servicesLabel}
              <span className="ml-2 text-xs text-gray-400">(Optional)</span>
            </Label.Root>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.requirements.serviceOptions.map((service) => {
                const IconComponent = serviceIcons[service.id] ?? Briefcase;
                return (
                  <label
                    key={service.id}
                    htmlFor={service.id}
                    className="flex items-center gap-3 bg-white p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    <input
                      id={service.id}
                      name="services"
                      value={service.id}
                      type="checkbox"
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {service.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <Label.Root
              htmlFor="details"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {sections.requirements.detailsLabel}
              <span className="ml-2 text-xs text-gray-400">(Optional)</span>
            </Label.Root>
            <textarea
              id="details"
              name="details"
              rows={5}
              placeholder={sections.requirements.detailsPlaceholder}
              className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>
      </div>

      <details className="pt-6 border-t border-gray-200">
        <summary className="cursor-pointer text-sm font-semibold text-gray-900">
          Optional project details
        </summary>
        <div className="mt-6 space-y-6">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-3">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{sections.company.title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label.Root
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {sections.company.companyLabel}
                  <span className="ml-2 text-xs text-gray-400">(Optional)</span>
                </Label.Root>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <Label.Root
                  htmlFor="industry"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {sections.company.industryLabel}
                  <span className="ml-2 text-xs text-gray-400">(Optional)</span>
                </Label.Root>
                <select
                  id="industry"
                  name="industry"
                  className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="">{sections.company.industryPlaceholder}</option>
                  {sections.company.industryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label.Root
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {sections.contact.phoneLabel}
                  <span className="ml-2 text-xs text-gray-400">(Optional)</span>
                </Label.Root>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-600 to-emerald-600 flex items-center justify-center mr-3">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Project details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label.Root
                  htmlFor="timeline"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  {sections.requirements.timelineLabel}
                  <span className="ml-2 text-xs text-gray-400">(Optional)</span>
                </Label.Root>
                <div className="relative">
                  <select
                    id="timeline"
                    name="timeline"
                    className="w-full bg-white px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                  >
                    <option value="">{sections.requirements.timelinePlaceholder}</option>
                    {sections.requirements.timelineOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <Label.Root
                  htmlFor="volume"
                  className="flex items-center text-sm font-medium text-gray-700 mb-2"
                >
                  <Package className="w-4 h-4 mr-2 text-gray-500" />
                  {sections.requirements.volumeLabel}
                  <span className="ml-2 text-xs text-gray-400">(Optional)</span>
                </Label.Root>
                <div className="relative">
                  <input
                    type="text"
                    id="volume"
                    name="volume"
                    placeholder={sections.requirements.volumePlaceholder}
                    className="w-full bg-white px-4 py-2 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </details>

      {/* Submit Button */}
      <div className="pt-6">
        <input
          type="submit"
          value={formCopy.submitLabel}
          className="w-full bg-linear-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 hover:shadow-xl active:scale-95"
        />
        <p className="text-sm text-gray-500 text-center mt-4">{formCopy.consentText}</p>
      </div>
    </form>
  );
}

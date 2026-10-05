import data from "@/lib/static-data.generated.json";

export type OpeningHours = Record<string, [string, string][]>;

type StaticBranch = {
  id: number;
  clinicId: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  phone: string | null;
  whatsapp: string | null;
  googleMapsUrl: string | null;
  openingHours: OpeningHours;
  latitude: string | null;
  longitude: string | null;
  imageUrl: string | null;
  active?: boolean;
};

type StaticDoctor = {
  id: number;
  clinicId: number;
  name: string;
  slug: string;
  specialty: string;
  bio: string;
  experience: string | null;
  certificates: string[];
  imageUrl: string;
  active?: boolean;
};

type StaticService = {
  id: number;
  clinicId: number;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  whatWeProvide: string[];
  whenNeeded: string[];
  process: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  imageUrl: string;
  active?: boolean;
};

type StaticProductCategory = {
  id: number;
  name: string;
  slug: string;
};

type StaticProduct = {
  id: number;
  clinicId: number;
  categoryId: number;
  name: string;
  slug: string;
  brand: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  usage: string | null;
  warnings: string | null;
  specifications: { label: string; value: string }[];
  price: string;
  stock: number;
  rating: string;
  reviewsCount: number;
  imageUrl: string;
  gallery: string[];
  petType: string;
  featured?: boolean;
  active?: boolean;
};

type StaticData = {
  clinics: Array<Record<string, unknown>>;
  branches: StaticBranch[];
  doctors: StaticDoctor[];
  services: StaticService[];
  products: StaticProduct[];
  productCategories: StaticProductCategory[];
  doctorServices: Array<{ doctorId: number; serviceId: number }>;
  doctorBranches: Array<{ doctorId: number; branchId: number }>;
  serviceProducts: Array<{ serviceId: number; productId: number }>;
};

const staticData = data as unknown as StaticData;

const active = <T extends { active?: boolean }>(rows: T[]) => rows.filter((row) => row.active !== false);

export async function getClinic() {
  return staticData.clinics[0] ?? null;
}

export async function getBranches() {
  return active(staticData.branches).sort((a, b) => a.id - b.id);
}

export async function getBranchBySlug(slug: string) {
  return staticData.branches.find((branch) => branch.slug === slug) ?? null;
}

export async function getDoctors() {
  return active(staticData.doctors).sort((a, b) => a.id - b.id);
}

export async function getDoctorBySlug(slug: string) {
  return staticData.doctors.find((doctor) => doctor.slug === slug) ?? null;
}

export async function getServices() {
  return active(staticData.services).sort((a, b) => a.id - b.id);
}

export async function getServiceBySlug(slug: string) {
  return staticData.services.find((service) => service.slug === slug) ?? null;
}

export async function getProducts() {
  return active(staticData.products).sort((a, b) => a.id - b.id);
}

export async function getFeaturedProducts() {
  return active(staticData.products).filter((product) => product.featured).sort((a, b) => a.id - b.id);
}

export async function getProductBySlug(slug: string) {
  return staticData.products.find((product) => product.slug === slug) ?? null;
}

export async function getProductCategories() {
  return [...staticData.productCategories].sort((a, b) => a.id - b.id);
}

export async function getServicesForDoctor(doctorId: number) {
  const ids = new Set(
    staticData.doctorServices.filter((link) => link.doctorId === doctorId).map((link) => link.serviceId),
  );
  return (await getServices()).filter((service) => ids.has(service.id));
}

export async function getBranchesForDoctor(doctorId: number) {
  const ids = new Set(
    staticData.doctorBranches.filter((link) => link.doctorId === doctorId).map((link) => link.branchId),
  );
  return (await getBranches()).filter((branch) => ids.has(branch.id));
}

export async function getDoctorsForService(serviceId: number) {
  const ids = new Set(
    staticData.doctorServices.filter((link) => link.serviceId === serviceId).map((link) => link.doctorId),
  );
  return (await getDoctors()).filter((doctor) => ids.has(doctor.id));
}

export async function getDoctorsForBranch(branchId: number) {
  const ids = new Set(
    staticData.doctorBranches.filter((link) => link.branchId === branchId).map((link) => link.doctorId),
  );
  return (await getDoctors()).filter((doctor) => ids.has(doctor.id));
}

export async function getEligibleDoctors(serviceId?: number, branchId?: number) {
  let eligible = await getDoctors();
  if (serviceId) eligible = eligible.filter((doctor) => staticData.doctorServices.some((link) => link.doctorId === doctor.id && link.serviceId === serviceId));
  if (branchId) eligible = eligible.filter((doctor) => staticData.doctorBranches.some((link) => link.doctorId === doctor.id && link.branchId === branchId));
  return eligible;
}

export async function getRelatedProducts(serviceId: number) {
  const ids = new Set(
    staticData.serviceProducts.filter((link) => link.serviceId === serviceId).map((link) => link.productId),
  );
  return (await getProducts()).filter((product) => ids.has(product.id));
}

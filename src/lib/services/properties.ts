import { Property, PropertyStatus, Inquiry, UserRole } from "@/types/database";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export interface PropertyFilterParams {
  purpose?: string;
  property_type?: string;
  governorate?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  sort?: string;
  page?: number;
  limit?: number;
  status?: PropertyStatus;
}

/**
 * Get active properties list taking into account custom additions and deletions
 */
export function getAllAvailableProperties(): Property[] {
  let list = [...MOCK_PROPERTIES];

  if (typeof window !== "undefined") {
    try {
      // 1. Add any user-created properties
      const customSaved = localStorage.getItem("mawaa_custom_properties");
      if (customSaved) {
        const customProps: Property[] = JSON.parse(customSaved);
        if (Array.isArray(customProps)) {
          // Prepend custom properties so they show at the top
          list = [...customProps, ...list];
        }
      }

      // 2. Filter out any deleted properties
      const deletedSaved = localStorage.getItem("mawaa_deleted_properties");
      if (deletedSaved) {
        const deletedIds: string[] = JSON.parse(deletedSaved);
        if (Array.isArray(deletedIds)) {
          list = list.filter((p) => !deletedIds.includes(p.id));
        }
      }
    } catch {
      // ignore
    }
  }

  return list;
}

export async function getProperties(params: PropertyFilterParams = {}) {
  const {
    purpose,
    property_type,
    governorate,
    district,
    minPrice,
    maxPrice,
    bedrooms,
    bathrooms,
    minArea,
    maxArea,
    sort = "newest",
    page = 1,
    limit = 9,
    status = "published",
  } = params;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase
        .from("properties")
        .select("*, images:property_images(*)", { count: "exact" })
        .eq("status", status);

      if (purpose && purpose !== "all") query = query.eq("purpose", purpose);
      if (property_type && property_type !== "all")
        query = query.eq("property_type", property_type);
      if (governorate && governorate !== "all")
        query = query.eq("governorate", governorate);
      if (district && district !== "all") query = query.eq("district", district);
      if (minPrice) query = query.gte("price", minPrice);
      if (maxPrice) query = query.lte("price", maxPrice);
      if (bedrooms) query = query.gte("bedrooms", bedrooms);
      if (bathrooms) query = query.gte("bathrooms", bathrooms);
      if (minArea) query = query.gte("area", minArea);
      if (maxArea) query = query.lte("area", maxArea);

      // Sorting
      if (sort === "price_asc") query = query.order("price", { ascending: true });
      else if (sort === "price_desc")
        query = query.order("price", { ascending: false });
      else if (sort === "area_desc")
        query = query.order("area", { ascending: false });
      else query = query.order("created_at", { ascending: false });

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error && data) {
        return {
          properties: data as Property[],
          total: count || 0,
          page,
          totalPages: Math.ceil((count || 0) / limit),
          isConfigured: true,
        };
      }
    } catch (err) {
      console.warn("Supabase query error, falling back to local catalog:", err);
    }
  }

  // Graceful Local / Demo Catalog Fallback
  let filtered = getAllAvailableProperties();

  if (status) {
    filtered = filtered.filter((p) => p.status === status);
  }

  if (purpose && purpose !== "all") {
    filtered = filtered.filter((p) => p.purpose === purpose);
  }

  if (property_type && property_type !== "all") {
    filtered = filtered.filter((p) => p.property_type === property_type);
  }

  if (governorate && governorate !== "all") {
    filtered = filtered.filter((p) => p.governorate === governorate);
  }

  if (district && district !== "all") {
    filtered = filtered.filter((p) => p.district === district);
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  if (bedrooms) {
    filtered = filtered.filter((p) => p.bedrooms >= bedrooms);
  }

  if (bathrooms) {
    filtered = filtered.filter((p) => p.bathrooms >= bathrooms);
  }

  if (minArea) {
    filtered = filtered.filter((p) => p.area >= minArea);
  }

  if (maxArea) {
    filtered = filtered.filter((p) => p.area <= maxArea);
  }

  // Sort
  if (sort === "price_asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === "area_desc") {
    filtered.sort((a, b) => b.area - a.area);
  } else {
    // Newest
    filtered.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  const total = filtered.length;
  const from = (page - 1) * limit;
  const paginated = filtered.slice(from, from + limit);

  return {
    properties: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
    isConfigured: isSupabaseConfigured(),
  };
}

export async function getPropertyBySlugOrId(identifier: string) {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          identifier
        );

      let query = supabase
        .from("properties")
        .select("*, images:property_images(*), profiles(*)");

      if (isUUID) {
        query = query.eq("id", identifier);
      } else {
        query = query.eq("slug", identifier);
      }

      const { data, error } = await query.single();
      if (!error && data) {
        return data as Property;
      }
    } catch (err) {
      console.warn("Supabase getProperty error, falling back to local:", err);
    }
  }

  const all = getAllAvailableProperties();
  return (
    all.find((p) => p.slug === identifier || p.id === identifier) || null
  );
}

export async function getFeaturedProperties(limit = 4) {
  const res = await getProperties({ limit, status: "published" });
  return res.properties.slice(0, limit);
}

export async function getRelatedProperties(
  property: Property,
  limit = 3
): Promise<Property[]> {
  const res = await getProperties({
    governorate: property.governorate,
    purpose: property.purpose,
    limit: limit + 1,
  });

  return res.properties.filter((p) => p.id !== property.id).slice(0, limit);
}

export async function deletePropertyById(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from("properties").delete().eq("id", id);
    } catch (err) {
      console.warn("Supabase deleteProperty error:", err);
    }
  }

  if (typeof window !== "undefined") {
    try {
      // 1. Add to deleted IDs list
      const deletedSaved = localStorage.getItem("mawaa_deleted_properties");
      let deletedIds: string[] = deletedSaved ? JSON.parse(deletedSaved) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem("mawaa_deleted_properties", JSON.stringify(deletedIds));
      }

      // 2. Remove from custom properties if exists
      const customSaved = localStorage.getItem("mawaa_custom_properties");
      if (customSaved) {
        let customProps: Property[] = JSON.parse(customSaved);
        customProps = customProps.filter((p) => p.id !== id);
        localStorage.setItem("mawaa_custom_properties", JSON.stringify(customProps));
      }

      window.dispatchEvent(new Event("properties-updated"));
      return true;
    } catch {
      return false;
    }
  }

  return true;
}

export async function getAdminMetrics() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const [
        { count: totalUsers },
        { count: totalListings },
        { count: pendingListings },
        { count: publishedListings },
        { count: totalInquiries },
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("properties").select("*", { count: "exact", head: true }),
        supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("properties")
          .select("*", { count: "exact", head: true })
          .eq("status", "published"),
        supabase.from("inquiries").select("*", { count: "exact", head: true }),
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalListings: totalListings || 0,
        pendingListings: pendingListings || 0,
        publishedListings: publishedListings || 0,
        totalInquiries: totalInquiries || 0,
        isConfigured: true,
      };
    } catch (err) {
      console.warn("Admin metrics query error:", err);
    }
  }

  const all = getAllAvailableProperties();
  return {
    totalUsers: 148,
    totalListings: all.length,
    pendingListings: all.filter((p) => p.status === "pending").length,
    publishedListings: all.filter((p) => p.status === "published").length,
    totalInquiries: 34,
    isConfigured: isSupabaseConfigured(),
  };
}

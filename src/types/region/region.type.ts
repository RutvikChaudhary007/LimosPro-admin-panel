import type { TRegion as TRegionForm } from "@/pages/region/formpage/AddRegionPage"

export interface IEditData extends Partial<TRegionForm> {
  permissionAccess?: string[]
}

export interface RegionManageAccessResponse {
  id: string
  permissionAccess: string[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface RegionalAdmin {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface StaffMember {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface TRegion {
  id: string
  regionName: string
  permissionAccess: string[]
  regionalAdmins: RegionalAdmin[]
  staffMembers: StaffMember[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

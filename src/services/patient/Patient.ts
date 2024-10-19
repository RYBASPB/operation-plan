export interface Patient {
  id: number
  name: string
  age?: number
  case_number: number
  inf: string
  diagnosis: string
  operation: string
  operation_date: Date | string
  order_by_date: number
  anesthesia: string
  team: string
}

export interface CreatePatient {
  name?: string
  age?: number
  case_number?: number
  inf?: string
  diagnosis?: string
  operation?: string
  operation_date?: Date | string
  order_by_date?: number
  anesthesia?: string
  team?: string
}
export interface UpdatePatient extends CreatePatient {
  id: number
}

export interface RepoResponse<T> {
  data?: T
  error?: string
}

export interface PatientRepository {
  Create(newPatientDto: CreatePatient): Promise<RepoResponse<Patient>>
  Update(updatePatientDto: UpdatePatient): Promise<RepoResponse<Patient | null>>
  Delete(id: number): Promise<RepoResponse<undefined>>
  GetAllByDate(date: Date): Promise<RepoResponse<Patient[]>>
  GetOne?(id: number): Promise<RepoResponse<Patient | null>>
}

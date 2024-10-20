import { CreatePatient, Patient, PatientRepository, RepoResponse, UpdatePatient } from '../patient/Patient.ts'
import { supabase } from '../../supabase.ts'
import { SupabaseClient } from '@supabase/supabase-js'

export class Supabase implements PatientRepository {
  private supabase: SupabaseClient
  constructor() {
    this.supabase = supabase
  }

  private transformDate(date: Date | string): string {
    if (date instanceof Date) {
      return date.toDateString()
    }
    return new Date(date).toDateString()
  }

  async GetAllByDate(date: Date): Promise<RepoResponse<Patient[]>> {
    const { data, error } = await this.supabase
      .from('patients')
      .select('*')
      .eq('operation_date', date.toDateString())
      .order('order_by_date')
      .returns<Patient[]>()
    if (error) {
      console.error(error)
    }
    return {
      data: data || undefined,
      error: error ? error.message : undefined,
    }
  }

  async Create(patient: CreatePatient): Promise<RepoResponse<Patient>> {
    const newPatient = { ...patient }
    if (patient.operation_date) {
      newPatient.operation_date = this.transformDate(patient.operation_date)
    }
    const { data, error } = await this.supabase
      .from('patients')
      .insert([newPatient])
      .select()
      .limit(1)
      .single<Patient>()
    return {
      data: data || undefined,
      error: error ? error.message : undefined,
    }
  }

  async Update(patient: UpdatePatient): Promise<RepoResponse<Patient>> {
    const newPatient = { ...patient }
    if (patient.operation_date) {
      newPatient.operation_date = this.transformDate(patient.operation_date)
    }
    const { data, error } = await this.supabase
      .from('patients')
      .update([newPatient])
      .eq('id', newPatient.id)
      .select()
      .returns<Patient>()
    return {
      data: data || undefined,
      error: error ? error.message : undefined,
    }
  }

  async Delete(id: number): Promise<RepoResponse<undefined>> {
    const { error } = await this.supabase
      .from('patients')
      .delete()
      .eq('id', id)
    return {
      error: error ? error.message : undefined,
    }
  }

  async Reorder(patients: Patient[]): Promise<RepoResponse<Patient[]>> {
    const { data, error } = await this.supabase
      .from('patients')
      .upsert(patients)
      .select('*')
      .returns<Patient[]>()
    return {
      data: data || undefined,
      error: error ? error.message : undefined,
    }
  }
}

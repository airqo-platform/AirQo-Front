import { Option } from "@/components/ui/multi-select"

export type ExportType = 'sites' | 'devices' | 'airqlouds' | 'regions'

export interface FormData {
  startDate: string
  endDate: string
  sites?: Option[]
  pollutants: Option[]
  frequency: string
  fileType: string
  outputFormat: string
  dataType: string
}
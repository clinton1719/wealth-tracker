export interface CalendarComponentProps {
  label: string
  date: Date | undefined
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

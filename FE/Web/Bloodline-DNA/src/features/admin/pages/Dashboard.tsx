import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { FlaskConical, Droplet, Users } from "lucide-react"
import { Card, CardContent } from "../../staff/components/sample/ui/card"

const data = [
  { name: "Máu", value: 25 },
  { name: "Nước bọt", value: 15 },
  { name: "Xương", value: 8 },
  { name: "Nước tiểu", value: 10 }
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-700">Thống kê lấy mẫu ADN</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<FlaskConical />} label="Tổng số mẫu" value="58" />
        <StatCard icon={<Droplet />} label="Mẫu máu" value="25" />
        <StatCard icon={<Users />} label="Người hiến mẫu" value="40" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Phân loại mẫu</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <Card className="bg-white shadow-md border border-blue-200">
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
          {icon}
        </div>
        <div>
          <div className="text-sm text-blue-500">{label}</div>
          <div className="text-xl font-bold text-blue-800">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}

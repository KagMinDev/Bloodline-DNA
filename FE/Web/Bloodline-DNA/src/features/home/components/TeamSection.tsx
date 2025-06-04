import type { TeamMember } from "../types/home.types";

const team: TeamMember[] = [
  {
    name: "TS. Nguyễn Minh",
    title: "Chuyên gia Di truyền học",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "PGS. Trần Hương",
    title: "Chuyên gia Phân tích ADN",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "BS. Lê Quang",
    title: "Tư vấn Huyết thống",
    image: "https://via.placeholder.com/150",
  },
  {
    name: "ThS. Phạm Linh",
    title: "Chuyên gia Phòng thí nghiệm",
    image: "https://via.placeholder.com/150",
  },
];

const TeamSection: React.FC = () => (
  <section className="py-16 bg-white md:py-20">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h2 className="mb-8 text-2xl font-bold text-center text-gray-800 md:text-3xl">
        Đội ngũ chuyên gia của chúng tôi
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, index) => (
          <div key={index} className="text-center">
            <img
              src={member.image}
              alt={member.name}
              className="object-cover w-24 h-24 mx-auto mb-4 rounded-full md:w-32 md:h-32"
            />
            <h3 className="text-base font-semibold text-gray-800 md:text-lg">
              {member.name}
            </h3>
            <p className="text-sm text-gray-600 md:text-base">{member.title}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TeamSection;

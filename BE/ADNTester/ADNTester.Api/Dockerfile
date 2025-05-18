FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy toàn bộ solution và project files vào container
COPY ["ADNTester.sln", "."]
COPY ["ADNTester.Api/ADNTester.Api.csproj", "ADNTester.Api/"]
COPY ["ADNTester.BO/ADNTester.BO.csproj", "ADNTester.BO/"]
COPY ["ADNTester.Repository/ADNTester.Repository.csproj", "ADNTester.Repository/"]
COPY ["ADNTester.Service/ADNTester.Service.csproj", "ADNTester.Service/"]

# Copy toàn bộ source code vào container
COPY . .

# Restore tất cả dependencies trong solution
RUN dotnet restore "./ADNTester.Api/ADNTester.Api.csproj"
# Copy toàn bộ source code vào container


WORKDIR "/src/ADNTester.Api"

# Build project API (bao gồm các project tham chiếu)
RUN dotnet build "./ADNTester.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ADNTester.Api.dll"]

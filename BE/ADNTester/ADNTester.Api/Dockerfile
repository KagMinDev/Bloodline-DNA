FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY ["ADNTester.sln", "."]
COPY ["ADNTester.Api/ADNTester.Api.csproj", "ADNTester.Api/"]
COPY ["ADNTester.BO/ADNTester.BO.csproj", "ADNTester.BO/"]
COPY ["ADNTester.Repository/ADNTester.Repository.csproj", "ADNTester.Repository/"]
COPY ["ADNTester.Service/ADNTester.Service.csproj", "ADNTester.Service/"]

COPY . .

RUN dotnet restore "./ADNTester.Api/ADNTester.Api.csproj"

WORKDIR "/src/ADNTester.Api"

RUN dotnet build "./ADNTester.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ADNTester.Api.dll"] 
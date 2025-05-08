"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Globe, Map, Building, Cloud, Cpu, Landmark, Clock, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

interface IpInfo {
  ip: string;
  version?: string;
  city?: string;
  region?: string;
  region_code?: string;
  country?: string;
  country_name?: string;
  country_code?: string;
  country_code_iso3?: string;
  country_capital?: string;
  country_tld?: string;
  continent_code?: string;
  in_eu?: boolean;
  postal?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utc_offset?: string;
  country_calling_code?: string;
  currency?: string;
  currency_name?: string;
  languages?: string;
  country_area?: number;
  country_population?: number;
  asn?: string;
  org?: string;
  isp?: string;
  hostname?: string;
}

export default function IpLookup() {
  const t = useTranslations("Ip");
  const tError = useTranslations("Error");
  const [currentIp, setCurrentIp] = useState<string>("");
  const [searchIp, setSearchIp] = useState<string>("");
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 获取当前IP
  useEffect(() => {
    const fetchCurrentIp = async () => {
      setLoading(true);
      setError(null);
      try {
        // 使用免费API获取当前IP
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setCurrentIp(data.ip);

        // 获取当前IP的信息
        await fetchIpInfo(data.ip);
      } catch (error) {
        setError(tError("query_failed"));
        setLoading(false);
      }
    };

    fetchCurrentIp();
  }, []);

  // 获取IP详细信息
  const fetchIpInfo = async (ip: string) => {
    try {
      // 使用免费的ipapi.co API
      const response = await fetch(`https://ipapi.co/${ip}/json/`);

      // 检查是否成功
      if (!response.ok) {
        throw new Error(`${tError("query_failed")}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // 检查是否有错误信息
      if (data.error) {
        setError(`${tError("query_failed")}: ${data.reason}`);
        setIpInfo(null);
      } else {
        setIpInfo(data);
        setError(null);
      }
    } catch (error: any) {
      setError(`${tError("query_failed")}: ${error.message}`);
      setIpInfo(null);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  // 查询IP
  const handleSearch = () => {
    // 清除之前的错误信息
    setError(null);

    // 检查是否输入了IP地址
    if (!searchIp) {
      setError(t("no_ip"));
      return;
    }

    setSearchLoading(true);
    fetchIpInfo(searchIp);
  };

  // 验证IP地址格式
  const isValidIp = (ip: string) => {
    // IPv4格式验证
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {/* 当前IP显示 */}
      <div className="mb-10 text-center">
        <p className="text-sm text-muted-foreground mb-2">{t("current_ip")}</p>
        {loading && !currentIp ? (
          <Skeleton className="h-16 w-80" />
        ) : (
          <h2 className="text-5xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            {currentIp}
          </h2>
        )}
      </div>

      {/* 搜索框 */}
      <div className="w-full max-w-2xl mb-10">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder={t("placeholder")}
            value={searchIp}
            onChange={(e) => {
              setSearchIp(e.target.value);
              // 当用户开始输入内容时，如果有"请输入要查询的IP地址"的错误提示，则清除它
              if (e.target.value && error === t("no_ip")) {
                setError(null);
              }
            }}
            className="text-xl py-6"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            size="lg"
            onClick={handleSearch}
            disabled={searchLoading || (!isValidIp(searchIp) && searchIp !== "")}
            className="px-8 whitespace-nowrap py-3 h-auto cursor-pointer"
          >
            {searchLoading ? t("querying") : t("query")}
            {!searchLoading && <Search className="ml-2 h-5 w-5" />}
          </Button>
        </div>
        {searchIp && !isValidIp(searchIp) && (
          <p className="text-sm text-destructive mt-1">{t("invalid_ip")}</p>
        )}
      </div>

      {/* 错误信息 */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 w-full max-w-3xl">
          <p>{error}</p>
        </div>
      )}

      {/* 查询结果 */}
      {(ipInfo) && (
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t("title")}
            </CardTitle>
            <CardDescription className="text-lg">
              {ipInfo.ip}
              {ipInfo.version && <span className="ml-2 text-xs bg-primary/10 rounded-md px-2 py-1">IPv{ipInfo.version}</span>}
            </CardDescription>
            <Separator />
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs defaultValue="location" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="location">{t("location")}</TabsTrigger>
                <TabsTrigger value="network">{t("network")}</TabsTrigger>
                <TabsTrigger value="details">{t("details")}</TabsTrigger>
              </TabsList>

              <TabsContent value="location">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ipInfo.city && (
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("city")}</p>
                        <p className="text-xl">{ipInfo.city}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.region && (
                    <div className="flex items-start gap-3">
                      <Map className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("region")}</p>
                        <p className="text-xl">{ipInfo.region} {ipInfo.region_code && `(${ipInfo.region_code})`}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.country_name && (
                    <div className="flex items-start gap-3">
                      <Landmark className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("country")}</p>
                        <p className="text-xl">{ipInfo.country_name} {ipInfo.country_code && `(${ipInfo.country_code})`}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.timezone && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("timezone")}</p>
                        <p className="text-xl">{ipInfo.timezone} {ipInfo.utc_offset && `(UTC ${ipInfo.utc_offset})`}</p>
                      </div>
                    </div>
                  )}

                  {(ipInfo.latitude && ipInfo.longitude) && (
                    <div className="md:col-span-2 flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("coordinates")}</p>
                        <p className="text-xl">{ipInfo.latitude}, {ipInfo.longitude}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="network">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ipInfo.asn && (
                    <div className="flex items-start gap-3">
                      <Cpu className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("asn")}</p>
                        <p className="text-xl">{ipInfo.asn}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.org && (
                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("organization")}</p>
                        <p className="text-xl line-clamp-2">{ipInfo.org}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.hostname && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("hostname")}</p>
                        <p className="text-xl line-clamp-2">{ipInfo.hostname}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.isp && (
                    <div className="flex items-start gap-3">
                      <Cloud className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("isp")}</p>
                        <p className="text-xl line-clamp-2">{ipInfo.isp}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ipInfo.postal && (
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("postal")}</p>
                        <p className="text-xl">{ipInfo.postal}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.currency && (
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("currency")}</p>
                        <p className="text-xl">{ipInfo.currency} {ipInfo.currency_name && `(${ipInfo.currency_name})`}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.languages && (
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("language")}</p>
                        <p className="text-xl">{ipInfo.languages}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.country_calling_code && (
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("telephone_code")}</p>
                        <p className="text-xl">{ipInfo.country_calling_code}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.continent_code && (
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("continent")}</p>
                        <p className="text-xl">{ipInfo.continent_code}</p>
                      </div>
                    </div>
                  )}

                  {ipInfo.country_population && (
                    <div className="flex items-start gap-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("population")}</p>
                        <p className="text-xl">{ipInfo.country_population.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          {/* <CardFooter className="flex justify-between text-sm text-muted-foreground">
            <p>数据来源: ipapi.co</p>
            <p>最后更新: {new Date().toLocaleString()}</p>
          </CardFooter> */}
        </Card>
      )}
    </div>
  );
} 
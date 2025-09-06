import { Select } from "antd";
import { useEffect, useState } from "react";

export function CapitalRecordSelect({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/capital-records")
      .then((res) => res.json())
      .then((data) => {
        setOptions(
          data.map((rec: any) => ({
            label: `${rec.description || "No Description"} (LKR${rec.amountInvested})`,
            value: rec._id,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Select
      showSearch
      placeholder="Select Capital Record"
      bordered={false}
      className="selectField-custom"
      loading={loading}
      options={options}
      value={value}
      onChange={onChange}
      filterOption={(input, option) =>
        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
      }
      style={{ width: "100%" }}
    />
  );
}

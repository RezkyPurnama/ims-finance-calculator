import { useState } from "react";

export default function App() {
  const [otr, setOtr] = useState("240000000");
  const [dp, setDp] = useState("20");
  const [jangka, setJangka] = useState("18");
  const [tanggalMulai, setTanggalMulai] = useState("2024-01-25");
  const [hasil, setHasil] = useState(null);
  const [jadwal, setJadwal] = useState([]);

  const hitungAngsuran = (e) => {
    e.preventDefault();

    const otrNum = parseFloat(otr);
    const dpNum = parseFloat(dp);
    const jangkaNum = parseFloat(jangka);

    if (!otrNum || !dpNum || !jangkaNum) {
      alert("Harap isi semua field dengan benar!");
      return;
    }

    // Hitung DP & pokok utang
    const dpRupiah = (dpNum / 100) * otrNum;
    const pokokUtang = otrNum - dpRupiah;

    // Tentukan bunga sesuai flowchart
    let bunga = 0;
    if (jangkaNum <= 12) bunga = 0.12;
    else if (jangkaNum > 12 && jangkaNum <= 24) bunga = 0.14;
    else bunga = 0.165;

    // Hitung angsuran per bulan (langsung sesuai flowchart)
    const angsuranPerBulan =
      (pokokUtang + pokokUtang * bunga * (jangkaNum / 12)) / jangkaNum;

    // Buat jadwal angsuran berdasarkan tanggal input user
    const startDate = new Date(tanggalMulai);
    const jadwalAngsuran = Array.from({ length: jangkaNum }, (_, i) => {
      const jatuhTempo = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + i,
        startDate.getDate()
      );
      return {
        angsuranKe: i + 1,
        angsuranPerBulan,
        tanggalTempo: jatuhTempo.toISOString().split("T")[0],
      };
    });

    setHasil({
      dpRupiah,
      pokokUtang,
      bunga: bunga * 100,
      angsuranPerBulan,
    });
    setJadwal(jadwalAngsuran);
  };

  const formatRupiah = (angka) =>
    angka.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-white p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-sky-100 w-full max-w-3xl p-8">
        <h1 className="text-3xl font-bold text-center text-sky-700 mb-8">
          🚗 Kalkulator Kredit Mobil IMS Finance
        </h1>

        {/* FORM INPUT */}
        <form onSubmit={hitungAngsuran} className="space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Harga Mobil (OTR)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
              value={otr}
              onChange={(e) => setOtr(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Down Payment (DP) %
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
              value={dp}
              onChange={(e) => setDp(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Jangka Waktu (bulan)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
              value={jangka}
              onChange={(e) => setJangka(e.target.value)}
            />
          </div>

          {/* Input tanggal mulai */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Tanggal Mulai Cicilan
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-400"
              value={tanggalMulai}
              onChange={(e) => setTanggalMulai(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold py-2 rounded-lg shadow-md hover:from-sky-600 hover:to-sky-700 transition-all"
          >
             Hitung Angsuran
          </button>
        </form>

        {/* HASIL */}
        {hasil && (
          <div className="bg-sky-50 border border-sky-200 rounded-xl mt-6 p-4 text-gray-800">
            <h2 className="text-lg font-semibold text-sky-700 mb-2">
              Hasil Perhitungan
            </h2>
            <p>
              <strong>Harga Mobil (OTR):</strong> {formatRupiah(parseFloat(otr))}
            </p>
            <p>
              <strong>Down Payment:</strong> {formatRupiah(hasil.dpRupiah)}
            </p>
            <p>
              <strong>Pokok Utang:</strong> {formatRupiah(hasil.pokokUtang)}
            </p>
            <p>
              <strong>Bunga Flat:</strong> {hasil.bunga.toFixed(1)}%
            </p>
            <p className="text-lg font-semibold text-sky-700">
              <strong>Angsuran per Bulan:</strong>{" "}
              {formatRupiah(hasil.angsuranPerBulan)}
            </p>
          </div>
        )}

        {/* TABEL JADWAL */}
        {jadwal.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-sky-700 mb-2">
              Jadwal Angsuran
            </h3>
            <table className="min-w-full border border-gray-300 text-sm text-gray-700">
              <thead className="bg-sky-100 text-sky-800">
                <tr>
                  <th className="border p-2">Angsuran Ke</th>
                  <th className="border p-2">Angsuran per Bulan</th>
                  <th className="border p-2">Tanggal Jatuh Tempo</th>
                </tr>
              </thead>
              <tbody>
                {jadwal.map((item) => (
                  <tr
                    key={item.angsuranKe}
                    className="odd:bg-white even:bg-sky-50"
                  >
                    <td className="border p-2 text-center">
                      {item.angsuranKe}
                    </td>
                    <td className="border p-2 text-center">
                      {formatRupiah(item.angsuranPerBulan)}
                    </td>
                    <td className="border p-2 text-center">
                      {item.tanggalTempo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

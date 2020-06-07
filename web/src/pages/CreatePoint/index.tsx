import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

import "./styles.css";

import logo from "../../assets/logo.svg";

import itemsService from "../../services/itemsService";
import ibgeService from "../../services/ibgeService";
import pointService from "../../services/pointService";
import Dropzone from "../../components/Dropzone";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialCenterMap, setInitialCenterMap] = useState<[number, number]>([
    0,
    0,
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });
  const [mapPoint, setMapPoint] = useState<[number, number]>([0, 0]);
  const [selectedUf, setSelectUf] = useState("0");
  const [selectedCity, setSelectCity] = useState("0");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const history = useHistory();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = { [event.target.name]: event.target.value };
    setFormData({ ...formData, ...input });
  };

  const handleChangeUf = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectUf(event.target.value);
  };
  const handleChangeCity = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectCity(event.target.value);
  };

  const handleMapClick = (event: LeafletMouseEvent) => {
    setMapPoint([event.latlng.lat, event.latlng.lng]);
  };

  const handleSelectItem = (id: number) => {
    const alreadySelected = selectedItems.includes(id);

    const newSelectedItems = alreadySelected
      ? selectedItems.filter((item_id) => item_id !== id)
      : [...selectedItems, id];

    setSelectedItems(newSelectedItems);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const [latitude, longitude] = mapPoint;
    const uf = selectedUf;
    const city = selectedCity;
    const items = selectedItems;

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("whatsapp", whatsapp);
    data.append("uf", uf);
    data.append("city", city);
    data.append("latitude", String(latitude));
    data.append("longitude", String(longitude));
    data.append("items", items.join(","));
    if (selectedFile) data.append("image", selectedFile);

    await pointService.registerPoint(data, () => {});
    alert("Ponto de coleta cadastrado com sucesso!");
    history.push("/");
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      setInitialCenterMap([latitude, longitude]);
    });
  }, []);

  useEffect(() => {
    itemsService.getItems((response) => {
      const data = response.data;
      setItems(data);
    });
  }, []);

  useEffect(() => {
    ibgeService.ufs((response) => {
      const ufInitials = response.data.map((uf) => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    ibgeService.citiesUF(selectedUf, (response) => {
      const citiesNames = response.data.map((city) => city.nome);
      setCities(citiesNames);
    });
  }, [selectedUf]);

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>
          Cadastro do <br /> ponto de coleta
        </h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialCenterMap} zoom={15} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapPoint} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleChangeUf}
              >
                <option value="0">Selecione uma UF</option>
                {ufs.map((uf, index) => {
                  return (
                    <option key={index} value={uf}>
                      {uf}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={handleChangeCity}
              >
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city, index) => {
                  return (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais pontos de coleta</span>
          </legend>
          <ul className="items-grid">
            {items.map((item: any) => {
              return (
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={selectedItems.includes(item.id) ? "selected" : ""}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              );
            })}
          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
};

export default CreatePoint;

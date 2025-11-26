# Patrón Singleton - Conexión a Base de Datos

## Descripción

El patrón Singleton garantiza que una clase tenga una única instancia y proporciona un punto de acceso global a ella.

## Implementación en el Proyecto

### Ubicación
`backend/src/config/database.ts`

### Razón de uso
Queremos asegurar que solo exista **una conexión** a la base de datos en toda la aplicación, evitando:
- Múltiples conexiones innecesarias
- Consumo excesivo de recursos
- Inconsistencias en las transacciones

### Características implementadas

1. **Constructor privado**: Impide la creación directa de instancias
```typescript
private constructor() {
  this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
}
```

2. **Instancia estática**: Almacena la única instancia de la clase
```typescript
private static instance: Database;
```

3. **Método getInstance()**: Punto de acceso global
```typescript
public static getInstance(): Database {
  if (!Database.instance) {
    Database.instance = new Database();
  }
  return Database.instance;
}
```

### Uso en el código
```typescript
// ✓ CORRECTO - Obtener la instancia
const db = Database.getInstance();
await db.connect();

// ✗ INCORRECTO - No se puede instanciar directamente
const db = new Database(); // Error: Constructor is private
```

### Ventajas

- ✅ Control sobre la instanciación
- ✅ Acceso global controlado
- ✅ Ahorro de recursos
- ✅ Consistencia en las operaciones

### Desventajas consideradas

- ⚠️ Puede dificultar el testing (solucionado con métodos como `close()`)
- ⚠️ Estado global (manejado con cuidado)

## Diagrama UML
```
┌─────────────────────────────┐
│       Database              │
├─────────────────────────────┤
│ - static instance: Database │
│ - db: sqlite3.Database      │
│ - dbPath: string            │
├─────────────────────────────┤
│ - constructor()             │
│ + static getInstance()      │
│ + connect()                 │
│ + getDb()                   │
│ + run()                     │
│ + all()                     │
│ + get()                     │
│ + close()                   │
└─────────────────────────────┘
```

## Testing

Ver: `backend/tests/unit/database.test.ts`